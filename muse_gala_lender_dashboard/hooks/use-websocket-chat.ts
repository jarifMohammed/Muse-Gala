"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSocket } from "@/contexts/websocket-context";

// Types for our chat data
interface ChatMessage {
  id: number | string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read" | "error";
  imageUrl?: string;
  chatId: string;
}

interface ChatConversation {
  id: string;
  customerName: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

// WebSocket message types
type WebSocketMessageType =
  | "new_message"
  | "message_status"
  | "user_typing"
  | "read_receipt"
  | "chat_list_update"
  | "error";

interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

export function useWebSocketChat(
  initialChats: ChatConversation[],
  initialMessages: Record<string, ChatMessage[]>
) {
  const {
    isConnected,
    sendMessage,
    lastMessage,
    connectionError,
    reconnect,
    isEnabled,
    setIsEnabled,
  } = useWebSocket();

  const [chats, setChats] = useState<ChatConversation[]>(initialChats);
  const [allMessages, setAllMessages] =
    useState<Record<string, ChatMessage[]>>(initialMessages);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [isSending, setIsSending] = useState(false);

  const messageIdCounter = useRef(1000); // For generating unique message IDs in fallback mode
  const isClient = typeof window !== "undefined";

  // Enable WebSocket when the component mounts
  useEffect(() => {
    if (!isClient) return;

    // Only enable WebSocket in production or if explicitly configured
    const shouldEnableWebSocket =
      process.env.NODE_ENV === "production" ||
      process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === "true";

    setIsEnabled(shouldEnableWebSocket);

    // Return cleanup function
    return () => {
      setIsEnabled(false);
    };
  }, [setIsEnabled, isClient]);

  // Process incoming WebSocket messages
  useEffect(() => {
    if (!isClient || !lastMessage) return;

    try {
      const message =
        typeof lastMessage === "string" ? JSON.parse(lastMessage) : lastMessage;

      switch (message.type) {
        case "new_message":
          handleNewMessage(message.payload);
          break;
        case "message_status":
          handleMessageStatus(message.payload);
          break;
        case "user_typing":
          handleUserTyping(message.payload);
          break;
        case "read_receipt":
          handleReadReceipt(message.payload);
          break;
        case "chat_list_update":
          handleChatListUpdate(message.payload);
          break;
        case "error":
          console.error("WebSocket error:", message.payload);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }, [lastMessage, isClient]);

  // Handle new incoming message
  const handleNewMessage = useCallback(
    (payload: { message: ChatMessage }) => {
      const { message } = payload;

      setAllMessages((prev) => {
        const chatMessages = [...(prev[message.chatId] || [])];
        const messageExists = chatMessages.some((msg) => msg.id === message.id);

        if (!messageExists) {
          return {
            ...prev,
            [message.chatId]: [...chatMessages, message],
          };
        }
        return prev;
      });

      // Update chat preview
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                preview: message.text,
                timestamp: message.timestamp,
                unread: activeChat !== message.chatId,
              }
            : chat
        )
      );

      // Send read receipt if this is the active chat
      if (activeChat === message.chatId) {
        sendReadReceipt(message.chatId, message.id);
      }
    },
    [activeChat]
  );

  // Handle message status updates
  const handleMessageStatus = useCallback(
    (payload: {
      chatId: string;
      messageId: number | string;
      status: "sent" | "delivered" | "read" | "error";
    }) => {
      const { chatId, messageId, status } = payload;

      setAllMessages((prev) => {
        const chatMessages = prev[chatId] || [];
        const updatedMessages = chatMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        );

        return {
          ...prev,
          [chatId]: updatedMessages,
        };
      });
    },
    []
  );

  // Handle typing indicators
  const handleUserTyping = useCallback(
    (payload: { chatId: string; isTyping: boolean }) => {
      const { chatId, isTyping: typing } = payload;

      setIsTyping((prev) => ({
        ...prev,
        [chatId]: typing,
      }));

      // Auto-clear typing indicator after 5 seconds as a fallback
      if (typing) {
        setTimeout(() => {
          setIsTyping((prev) => ({
            ...prev,
            [chatId]: false,
          }));
        }, 5000);
      }
    },
    []
  );

  // Handle read receipts
  const handleReadReceipt = useCallback(
    (payload: { chatId: string; messageIds: (number | string)[] }) => {
      const { chatId, messageIds } = payload;

      setAllMessages((prev) => {
        const chatMessages = prev[chatId] || [];
        const updatedMessages = chatMessages.map((msg) =>
          messageIds.includes(msg.id)
            ? { ...msg, status: "read" as const }
            : msg
        );

        return {
          ...prev,
          [chatId]: updatedMessages,
        };
      });
    },
    []
  );

  // Handle chat list updates
  const handleChatListUpdate = useCallback(
    (payload: { chats: ChatConversation[] }) => {
      setChats(payload.chats);
    },
    []
  );

  // Send a new message - with fallback for when WebSocket is not available
  const sendChatMessage = useCallback(
    (chatId: string, text: string, imageUrl?: string) => {
      if (!isClient || !chatId) return false;

      setIsSending(true);

      // Create a temporary message with local ID
      const tempId = isConnected
        ? `temp-${Date.now()}`
        : messageIdCounter.current++;
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMessage: ChatMessage = {
        id: tempId,
        sender: "admin",
        text,
        timestamp,
        status: "sending",
        imageUrl,
        chatId,
      };

      // Add to local state immediately
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));

      // Update chat preview
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                preview: text,
                timestamp,
              }
            : chat
        )
      );

      // If WebSocket is connected, send via WebSocket
      if (isConnected) {
        const success = sendMessage({
          type: "new_message",
          payload: {
            tempId,
            chatId,
            text,
            imageUrl,
          },
        });

        if (!success) {
          // Handle send failure
          handleFallbackMessageFlow(chatId, tempId);
        }
      } else {
        // Fallback to simulated message flow when WebSocket is not available
        handleFallbackMessageFlow(chatId, tempId);
      }

      setIsSending(false);
      return true;
    },
    [isConnected, sendMessage, isClient]
  );

  // Simulate message flow when WebSocket is not available
  const handleFallbackMessageFlow = useCallback(
    (chatId: string, messageId: number | string) => {
      if (!isClient) return;

      // Simulate message being sent
      setTimeout(() => {
        setAllMessages((prev) => {
          const chatMessages = prev[chatId] || [];
          const updatedMessages = chatMessages.map((msg) =>
            msg.id === messageId ? { ...msg, status: "sent" as const } : msg
          );
          return {
            ...prev,
            [chatId]: updatedMessages,
          };
        });

        // Simulate message being delivered
        setTimeout(() => {
          setAllMessages((prev) => {
            const chatMessages = prev[chatId] || [];
            const updatedMessages = chatMessages.map((msg) =>
              msg.id === messageId
                ? { ...msg, status: "delivered" as const }
                : msg
            );
            return {
              ...prev,
              [chatId]: updatedMessages,
            };
          });

          // Simulate message being read
          setTimeout(() => {
            setAllMessages((prev) => {
              const chatMessages = prev[chatId] || [];
              const updatedMessages = chatMessages.map((msg) =>
                msg.id === messageId ? { ...msg, status: "read" as const } : msg
              );
              return {
                ...prev,
                [chatId]: updatedMessages,
              };
            });

            // Simulate typing response
            setIsTyping((prev) => ({
              ...prev,
              [chatId]: true,
            }));

            setTimeout(() => {
              setIsTyping((prev) => ({
                ...prev,
                [chatId]: false,
              }));

              // Add a simulated response message
              const responseMessage: ChatMessage = {
                id: messageIdCounter.current++,
                sender: "user",
                text: "Thanks for the information!",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                status: "read",
                chatId,
              };

              setAllMessages((prev) => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), responseMessage],
              }));

              // Update chat preview
              setChats((prev) =>
                prev.map((chat) =>
                  chat.id === chatId
                    ? {
                        ...chat,
                        preview: responseMessage.text,
                        timestamp: responseMessage.timestamp,
                      }
                    : chat
                )
              );
            }, 3000);
          }, 1000);
        }, 1000);
      }, 1000);
    },
    [isClient]
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (chatId: string, isTyping: boolean) => {
      if (!isClient || !chatId) return;

      if (!isConnected) {
        // If not connected, just update local state for UI
        setIsTyping((prev) => ({
          ...prev,
          [chatId]: isTyping,
        }));
        return;
      }

      sendMessage({
        type: "user_typing",
        payload: {
          chatId,
          isTyping,
        },
      });
    },
    [isConnected, sendMessage, isClient]
  );

  // Send read receipt
  const sendReadReceipt = useCallback(
    (chatId: string, messageId: number | string) => {
      if (!isClient || !chatId) return;

      if (isConnected) {
        sendMessage({
          type: "read_receipt",
          payload: {
            chatId,
            messageId,
          },
        });
      }

      // Also mark chat as read locally
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unread: false } : chat
        )
      );
    },
    [isConnected, sendMessage, isClient]
  );

  // Mark all messages in a chat as read
  const markChatAsRead = useCallback(
    (chatId: string) => {
      if (!isClient || !chatId) return;

      const unreadMessageIds = (allMessages[chatId] || [])
        .filter((msg) => msg.sender === "user" && msg.status !== "read")
        .map((msg) => msg.id);

      if (unreadMessageIds.length > 0 && isConnected) {
        sendMessage({
          type: "read_receipt",
          payload: {
            chatId,
            messageIds: unreadMessageIds,
          },
        });
      }

      // Mark messages as read locally
      setAllMessages((prev) => {
        const chatMessages = prev[chatId] || [];
        const updatedMessages = chatMessages.map((msg) =>
          msg.sender === "user" && msg.status !== "read"
            ? { ...msg, status: "read" as const }
            : msg
        );

        return {
          ...prev,
          [chatId]: updatedMessages,
        };
      });

      // Mark chat as read locally
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unread: false } : chat
        )
      );
    },
    [allMessages, sendMessage, isConnected, isClient]
  );

  // Change active chat
  const changeActiveChat = useCallback(
    (chatId: string) => {
      if (!isClient) return;

      setActiveChat(chatId);
      markChatAsRead(chatId);
    },
    [markChatAsRead, isClient]
  );

  return {
    chats,
    setChats,
    allMessages,
    setAllMessages,
    activeChat,
    setActiveChat: changeActiveChat,
    isTyping,
    isSending,
    connectionError,
    isConnected,
    sendChatMessage,
    sendTypingIndicator,
    markChatAsRead,
    reconnect,
    isWebSocketEnabled: isEnabled,
  };
}

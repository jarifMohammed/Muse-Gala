'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Download,
  File,
  Image as ImageIcon,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useMessageActions } from '@/hooks/useMessageActions'

interface Attachment {
  url: string
  type: string
  fileName: string
  size: number
  mimeType: string
}

interface Message {
  id: string
  content: string
  sender: boolean
  timestamp: string
  rawSenderId?: string
  attachments?: Attachment[]
}

interface MessageProps {
  messages: Message[]
  currentUserId: string
  chatRoomId?: string
  isLoading?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function ChatMessages({
  messages,
  chatRoomId,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: MessageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const prevMessagesLengthRef = useRef<number>(0)

  // Get edit/delete functions
  const { editMessage, isEditing, deleteMessage, isDeleting } =
    useMessageActions()

  const orderedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  const messageCount = orderedMessages.length

  // Auto-scroll logic
  useEffect(() => {
    if (!containerRef.current || !isAutoScroll) return

    const isNewMessage = messageCount > prevMessagesLengthRef.current
    if (isNewMessage) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    prevMessagesLengthRef.current = messageCount
  }, [messageCount, isAutoScroll])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'auto',
    })
    setIsAutoScroll(true)
    prevMessagesLengthRef.current = messageCount
  }, [chatRoomId, messageCount])

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    setIsAutoScroll(isAtBottom)
  }, [])

  // Edit message handlers
  const handleEditClick = (message: Message) => {
    setEditingMessageId(message.id)
    setEditText(message.content)
  }

  const handleEditSave = async () => {
    if (!editingMessageId || !editText.trim() || !chatRoomId) return

    try {
      await editMessage({
        messageId: editingMessageId,
        newText: editText.trim(),
        chatRoom: chatRoomId,
      })

      // Reset editing state
      setEditingMessageId(null)
      setEditText('')
    } catch (error) {
      console.error('Error editing message:', error)
      alert('Failed to edit message. Please try again.')
    }
  }

  const handleEditCancel = () => {
    setEditingMessageId(null)
    setEditText('')
  }

  const handleDeleteClick = (messageId: string) => {
    setDeleteConfirmId(messageId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId || !chatRoomId) return

    try {
      await deleteMessage({
        messageId: deleteConfirmId,
        chatRoom: chatRoomId,
      })

      setDeleteConfirmId(null)
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  // Render attachment
  const renderAttachment = (attachment: Attachment) => {
    const { url, type, fileName } = attachment

    if (type === 'image') {
      return (
        <div className="mt-2 relative group">
          <Image
            src={url}
            alt={fileName}
            width={200}
            height={200}
            className="max-h-64 w-full max-w-[280px] cursor-pointer rounded-md object-cover transition-transform group-hover:scale-[1.01] md:max-h-80 md:max-w-[400px]"
            onClick={() => setPreviewImage(url)}
            unoptimized={url.startsWith('blob:') || url.startsWith('data:')}
          />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
            <ImageIcon className="h-5 w-5 text-white bg-black/40 rounded-full p-1" />
          </div>
        </div>
      )
    }

    if (type === 'video') {
      return (
        <div className="mt-2 rounded-xl overflow-hidden bg-black max-w-[280px] md:max-w-[400px]">
          <video
            controls
            className="w-full h-auto rounded-xl"
            style={{ aspectRatio: '16/9' }}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    // Other files (PDF, Docs, etc.)
    return (
      <div className="mt-2 flex items-center gap-2 p-2 bg-gray-100 text-gray-700 rounded-lg">
        <File className="h-5 w-5 text-gray-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download
          </a>
        </div>
      </div>
    )
  }

  if (isLoading && orderedMessages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#fbfaf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#891D33] mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (!orderedMessages?.length) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#fbfaf9] px-6">
        <div className="max-w-xs rounded-md border border-dashed border-gray-200 bg-white px-6 py-8 text-center">
          <p className="mb-2 text-sm font-semibold text-gray-600">No messages yet</p>
          <p className="text-xs leading-relaxed text-gray-400">Send the first message to start this conversation.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[#fbfaf9] px-3 py-4 scrollbar-hide sm:px-5 md:px-6 md:py-6"
      >
        {hasNextPage && (
          <div className="flex justify-center mb-6 sticky top-0 z-10">
            <Button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              variant="outline"
              size="sm"
              className="bg-white border-gray-100 rounded-full font-medium text-[11px] hover:bg-gray-50 text-[#54051d] shadow-sm px-4"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#54051d] mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load more messages'
              )}
            </Button>
          </div>
        )}

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
          {orderedMessages.map((message, index) => {
            const isMyMessage = message.sender
            const nextMessageIsSameSender = orderedMessages[index + 1]?.sender === isMyMessage
            const messageDate = new Date(message.timestamp)
            const time = messageDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                className={`flex items-end gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'
                  } ${!nextMessageIsSameSender ? 'mb-4' : 'mb-1'}`}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Avatar for receiver */}
                {!isMyMessage && (
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-opacity ${!nextMessageIsSameSender ? 'opacity-100' : 'opacity-0'}`}>
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[82%] px-3.5 py-2.5 text-sm shadow-sm transition-all sm:max-w-[72%] md:max-w-[66%] ${isMyMessage
                    ? 'rounded-2xl rounded-br-[4px] bg-[#54051d] text-white'
                    : 'rounded-2xl rounded-bl-[4px] border border-gray-100 bg-white text-gray-900'
                    }`}
                >
                  {/* Edit/Delete buttons (only for my messages) */}
                  {isMyMessage &&
                    hoveredMessageId === message.id &&
                    !editingMessageId && (
                      <div className="absolute -left-20 top-1/2 hidden -translate-y-1/2 gap-1 rounded-full border border-gray-100 bg-white px-2 py-1 shadow-sm md:flex">
                        <button
                          onClick={() => handleEditClick(message)}
                          className="rounded-full p-1 px-1.5 transition-colors hover:bg-gray-50"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(message.id)}
                          className="rounded-full p-1 px-1.5 transition-colors hover:bg-gray-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </button>
                      </div>
                    )}

                  {/* Message content */}
                  {editingMessageId === message.id ? (
                    <div className="mb-1 min-w-[220px] max-w-[72vw]">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full resize-none rounded-md border-none bg-white/10 p-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20"
                        rows={3}
                        autoFocus
                        disabled={isEditing}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleEditSave}
                          disabled={isEditing || !editText.trim()}
                          className="px-3 py-1 bg-white text-[#54051d] rounded-full text-xs font-bold disabled:opacity-50"
                        >
                          {isEditing ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={handleEditCancel}
                          disabled={isEditing}
                          className="px-3 py-1 bg-transparent text-white border border-white/20 rounded-full text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.content && (
                        <p className="break-words whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      )}
                      {message.attachments?.length
                        ? message.attachments.map((a, i) => (
                          <div key={i}>{renderAttachment(a)}</div>
                        ))
                        : null}
                    </>
                  )}

                  {/* Tooltip-style time */}
                  {!nextMessageIsSameSender && (
                    <span className={`absolute -bottom-5 whitespace-nowrap text-[10px] font-medium text-gray-400 ${isMyMessage ? 'right-1' : 'left-1'}`}>
                      {time}
                    </span>
                  )}

                  {isMyMessage && !editingMessageId && !nextMessageIsSameSender && (
                    <div className="absolute -bottom-6 left-0 flex gap-1 md:hidden">
                      <button
                        onClick={() => handleEditClick(message)}
                        className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 shadow-sm ring-1 ring-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(message.id)}
                        className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-red-500 shadow-sm ring-1 ring-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 rounded-full p-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Message?
                </h3>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteCancel}
                  variant="outline"
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image
                src={previewImage || ''}
                alt="Preview"
                width={200}
                height={200}
                quality={100}
                className="max-h-[90vh] rounded-lg object-contain"
                style={{ width: 'auto', height: '80vh' }}
                unoptimized={
                  previewImage?.startsWith('blob:') ||
                  previewImage?.startsWith('data:')
                }
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

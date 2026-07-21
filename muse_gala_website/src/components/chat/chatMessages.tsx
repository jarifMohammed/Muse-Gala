/* eslint-disable react-hooks/exhaustive-deps */
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
  Check,
  X as CloseIcon,
  AlertTriangle,
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

  // Auto-scroll logic
  useEffect(() => {
    if (!containerRef.current || !isAutoScroll) return

    const isNewMessage = orderedMessages.length > prevMessagesLengthRef.current
    if (isNewMessage) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    prevMessagesLengthRef.current = orderedMessages.length
  }, [orderedMessages.length, isAutoScroll])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'auto',
    })
    setIsAutoScroll(true)
    prevMessagesLengthRef.current = orderedMessages.length
  }, [chatRoomId])

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
        <div className="mt-2 relative group w-full max-w-sm md:max-w-md">
          <Image
            src={url}
            alt={fileName}
            width={800} // big resolution for sharpness
            height={800}
            quality={100}
            className="rounded-xl w-full max-h-[320px] object-contain cursor-pointer transition-transform group-hover:scale-[1.02]"
            onClick={() => setPreviewImage(url)}
          />

          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
            <ImageIcon className="h-5 w-5 text-white bg-black/40 rounded-full p-1" />
          </div>
        </div>
      )
    }

    if (type === 'video') {
      return (
        <div className="mt-2 rounded-xl overflow-hidden bg-black w-full max-w-sm md:max-w-md">
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
      <div className="mt-2 flex items-center gap-2 p-2 text-gray-700 bg-gray-100 rounded-lg">
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (!orderedMessages?.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">No messages yet</p>
          <p className="text-gray-400 text-xs">Start a conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-auto p-4 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
             h-[calc(100vh-280px)] sm:h-[calc(100vh-220px)]"
      >
        {hasNextPage && (
          <div className="flex justify-center mb-4 sticky top-0 z-10">
            <Button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              variant="outline"
              size="sm"
              className="bg-slate-50 border-gray-200 rounded-full font-light text-[12px] hover:bg-slate-100/80 text text shadow-sm"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#891D33] mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Messages....'
              )}
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {orderedMessages.map((message) => {
            const isMyMessage = message.sender
            const messageDate = new Date(message.timestamp)
            const time = messageDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div
                  className={`flex ${
                    isMyMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 text-[13px] sm:text-sm shadow-sm relative ${
                      isMyMessage
                        ? 'bg-gray-800 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {/* Edit/Delete buttons (only for my messages) */}
                    {isMyMessage &&
                      hoveredMessageId === message.id &&
                      !editingMessageId && (
                        <div className="absolute top-[50%] translate-y-[-50%] -left-[70px] flex gap-1 bg-white rounded-lg p-1 shadow-md border border-gray-200">
                          <button
                            onClick={() => handleEditClick(message)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Edit message"
                          >
                            <Edit3 className="h-3 w-3 text-gray-700" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(message.id)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                      )}

                    {/* Message content - either editable or static */}
                    {editingMessageId === message.id ? (
                      <div className="mb-1">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border border-gray-800 rounded-lg text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-gray-700"
                          rows={3}
                          autoFocus
                          disabled={isEditing}
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={handleEditSave}
                            size="sm"
                            disabled={isEditing || !editText?.trim()}
                            className="bg-white h-8 text-gray-700 hover:bg-white/80"
                          >
                            {isEditing ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700 mr-1"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={handleEditCancel}
                            variant="default"
                            size="sm"
                            disabled={isEditing}
                            className="h-8 bg-gray-500 hover:bg-gray-600/90"
                          >
                            <CloseIcon className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {message.content && (
                          <p className="break-words whitespace-pre-wrap">
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

                    <p
                      className={`text-[10px] mt-1 text-right ${
                        isMyMessage ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {time}
                    </p>
                  </div>
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
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
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
            {/* ✅ Parent MUST have relative + fixed height for `fill` to work */}
            <div className="relative w-full max-w-5xl h-[80vh]">
              <Image
                src={previewImage}
                alt="Preview"
                quality={100}
                fill
                className="object-contain rounded-lg"
                unoptimized={
                  previewImage.startsWith('blob:') ||
                  previewImage.startsWith('data:')
                }
              />

              {/* Close Button */}
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

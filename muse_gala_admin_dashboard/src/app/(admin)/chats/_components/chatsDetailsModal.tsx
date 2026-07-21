'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { File} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useChatStore } from '@/store/useChatStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export type Conversation = {
  _id: string
  bookingId: string
  customerId: string
  lenderId: string
  customerName: string
  lenderName: string
  date: string
  lastMessage?: string
  status?: string
  flagged?: boolean
}

interface ChatsDetailsPopupProps {
  conversation: Conversation
  children: React.ReactNode
}

export function ChatsDetailsPopup({
  conversation,
  children,
}: ChatsDetailsPopupProps) {
  const {
    messages,
    fetchMessages,
    reset,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    page,
  } = useChatStore()

  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [flagModalOpen, setFlagModalOpen] = useState(false)
  const [closeModalOpen, setCloseModalOpen] = useState(false)
  const [activeModalOpen, setActiveModalOpen] = useState(false)
  const [reason, setReason] = useState('')

  // ✅ Common PUT API mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (payload: { status: string; reason?: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/chatrooms/admin/${conversation._id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) throw new Error('Failed to update conversation status')
      return res.json()
    },
    onSuccess: (_, variables) => {
      toast.success(`Conversation marked as ${variables.status}`)
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
      setReason('')
      setFlagModalOpen(false)
      setCloseModalOpen(false)
      setActiveModalOpen(false)
    },
    onError: () => {
      toast.error('Failed to update conversation status')
    },
  })

  // ✅ Auto scroll
  useEffect(() => {
    if (!isFetchingMore && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages.length, isFetchingMore])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      reset()
      fetchMessages(conversation._id, accessToken, 1)
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      fetchMessages(conversation._id, accessToken, page + 1, true)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderAttachment = (attachment: any) => {
    const { url, type, fileName } = attachment

    if (type === 'image') {
      return (
        <div className="mt-2 relative">
          <Image
            src={url}
            alt={fileName}
            width={200}
            height={200}
            className="rounded-xl max-w-[280px] object-cover"
            style={{ width: '100%', height: '250px' }}
            unoptimized={url.startsWith('blob:') || url.startsWith('data:')}
          />
        </div>
      )
    }

    if (type === 'video') {
      return (
        <div className="mt-2 rounded-xl overflow-hidden bg-black max-w-[280px]">
          <video controls className="w-full h-auto rounded-xl">
            <source src={url} type="video/mp4" />
          </video>
        </div>
      )
    }

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
            
          </a>
        </div>
      </div>
    )
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto p-3 py-8 space-y-4 font-sans">
        <DialogHeader>
          <div className="flex justify-center mb-7 mt-6">
            <Image
              src="/logo.png"
              alt="Chat Details"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="flex justify-start">
            <span className="text-lg font-light">
              <strong className="font-normal">Conversation ID:</strong>{' '}
              {conversation._id}
            </span>
          </div>
        </DialogHeader>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">
              Conversation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 font-light">
            <p>
              <strong>Booking ID:</strong> {conversation?.bookingId || 'N/A'}
            </p>
            <p>
              <strong>Customer:</strong>{' '}
              {conversation.customerName || 'N/A'} (
              <span className="text-xs text-gray-500">
                {conversation.customerId || 'N/A'}
              </span>
              )
            </p>
            <p>
              <strong>Lender:</strong> {conversation.lenderName || 'N/A'} (
              <span className="text-xs text-gray-500">
                {conversation.lenderId || 'N/A'}
              </span>
              )
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-xs ${
                  conversation.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : conversation.status === 'closed'
                    ? 'bg-gray-100 text-gray-700'
                    : conversation.status === 'flagged'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {conversation.status || 'N/A'}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[500px] overflow-y-auto p-4 bg-white border rounded-lg">
              {isLoading ? (
                <div className="flex justify-center font-light items-center h-full text-sm text-gray-500">
                  Loading messages...
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center h-full text-sm text-red-500">
                  {error}
                  <Button
                    onClick={() =>
                      fetchMessages(conversation._id, accessToken, 1)
                    }
                    size="sm"
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                  No messages found.
                </div>
              ) : (
                <>
                  {hasMore && (
                    <div className="flex justify-center mb-3">
                      <Button
                        onClick={handleLoadMore}
                        disabled={isFetchingMore}
                        size="sm"
                        variant="outline"
                        className="font-light text-sm rounded-3xl"
                      >
                        {isFetchingMore ? 'Loading...' : 'Load More Messages'}
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {messages.map(message => {
                      const isLender =
                        message.sender._id === conversation.lenderId ||
                        message.sender.role === 'LENDER'
                      const messageDate = new Date(message.createdAt)
                      const time = messageDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            isLender ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                              isLender
                                ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                                : 'bg-slate-700 text-white rounded-br-none'
                            }`}
                          >
                            <p className="text-xs mb-1 opacity-70 font-medium">
                              {isLender ? 'Lender' : 'Customer'}
                            </p>
                            {message.message && <p>{message.message}</p>}
                            {message.attachments?.map((a, i) => (
                              <div key={i}>{renderAttachment(a)}</div>
                            ))}
                            <p
                              className={`text-[10px] mt-1 text-right ${
                                isLender ? 'text-gray-500' : 'text-gray-300'
                              }`}
                            >
                              {time}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            {/* Flag Modal */}
            <Dialog open={flagModalOpen} onOpenChange={setFlagModalOpen}>
              <DialogTrigger asChild>
                <Button className="font-normal" variant="destructive">
                  Flag Conversation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md space-y-4">
                <DialogHeader>
                  <p className="text-lg font-semibold">
                    Why are you flagging this conversation?
                  </p>
                </DialogHeader>
                <Textarea
                  placeholder="Write your reason here..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFlagModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!reason || updateStatusMutation.isPending}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        status: 'flagged',
                        reason,
                      })
                    }
                  >
                    {updateStatusMutation.isPending
                      ? 'Submitting...'
                      : 'Submit'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Close Confirmation */}
            <AlertDialog open={closeModalOpen} onOpenChange={setCloseModalOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="font-normal">
                  Close Conversation
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="space-y-3">
                <AlertDialogHeader>
                  <p className="text-lg font-semibold">
                    Are you sure you want to close this conversation?
                  </p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      updateStatusMutation.mutate({ status: 'closed' })
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? 'Closing...'
                      : 'Yes, Close it'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Activate Confirmation */}
            <AlertDialog
              open={activeModalOpen}
              onOpenChange={setActiveModalOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="font-normal">
                  Activate Conversation
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="space-y-3">
                <AlertDialogHeader>
                  <p className="text-lg font-semibold">
                    Are you sure you want to activate this conversation?
                  </p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      updateStatusMutation.mutate({ status: 'active' })
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? 'Activating...'
                      : 'Yes, Activate it'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

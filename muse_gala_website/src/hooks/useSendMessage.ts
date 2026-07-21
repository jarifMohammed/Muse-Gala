import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserStore } from '@/zustand/useUserStore'

interface MessagePayload {
  text?: string
  chatRoom: string
  file?: File
}

export const useSendMessage = () => {
  const { user } = useUserStore()
  const accessToken = user?.accessToken || ''
  const senderId = user?.id || ''
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: MessagePayload) => {
      console.log('📤 Sending message payload:', payload)

      const formData = new FormData()
      formData.append('roomId', payload.chatRoom)
      formData.append('sender', senderId)

      // Only append message if it exists and is not empty
      if (payload.text?.trim()) {
        formData.append('message', payload.text.trim())
        console.log('messages for test', payload.text)
      }

      // Append file if it exists
      if (payload.file) {
        formData.append('attachments', payload.file)
      }

      console.log('📤 FormData contents:', {
        roomId: payload.chatRoom,
        sender: senderId,
        hasText: !!payload.text?.trim(),
        hasFile: !!payload.file,
      })

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Don't set Content-Type for FormData, let browser set it
          },
          body: formData,
        },
      )

      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Failed to send message:', res.status, errorText)
        throw new Error(`Failed to send message: ${res.status}`)
      }

      const result = await res.json()
      console.log('✅ Message sent successfully:', result)

      // ✅ Invalidate both current chat messages + conversations
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      })
      queryClient.invalidateQueries({
        queryKey: ['messages', payload.chatRoom],
      })

      return result.data
    },
    onError: error => {
      console.error('❌ Error sending message:', error)
    },
  })
}

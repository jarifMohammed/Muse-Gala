import { useUserStore } from '@/zustand/useUserStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface EditMessagePayload {
  messageId: string
  newText: string
  chatRoom: string
}

interface DeleteMessagePayload {
  messageId: string
  chatRoom: string
}

export const useMessageActions = () => {
  const { user } = useUserStore()
  const accessToken = user?.accessToken || ''
  const queryClient = useQueryClient()

  // Edit message mutation
  const editMessage = useMutation({
    mutationFn: async (payload: EditMessagePayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/${payload.messageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: payload.newText,
          }),
        }
      )

      if (!res.ok) {
        throw new Error('Failed to edit message')
      }

      return res.json()
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.chatRoom],
      })
    },
  })

  // Delete message mutation
  const deleteMessage = useMutation({
    mutationFn: async (payload: DeleteMessagePayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/${payload.messageId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to delete message')
      }

      return res.json()
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.chatRoom],
      })
    },
  })

  return {
    editMessage: editMessage.mutateAsync,
    isEditing: editMessage.isPending,
    deleteMessage: deleteMessage.mutateAsync,
    isDeleting: deleteMessage.isPending,
  }
}

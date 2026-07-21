import { useQuery } from '@tanstack/react-query'
import { useUserStore } from '@/zustand/useUserStore'

export const useConversations = () => {
  const { user } = useUserStore()
  const accessToken = user?.accessToken || ''

  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/chatrooms`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch conversations')
      return res.json()
    },
    enabled: Boolean(accessToken),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  })
}

// socketStore.ts
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  connectSocket: (userId: string) => void
  disconnectSocket: () => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connectSocket: (userId) => {
    const existingSocket = get().socket

    // ✅ Reuse existing connection if already connected
    if (existingSocket?.connected) {
      console.log('✅ Socket already connected, reusing:', existingSocket.id)
      return
    }

    // ✅ Disconnect old socket if exists but not connected
    if (existingSocket) {
      existingSocket.disconnect()
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { userId },
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
      set({ isConnected: true })
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      set({ isConnected: false })
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts')
      set({ isConnected: true })
    })

    set({ socket })
  },

  disconnectSocket: () => {
    const socket = get().socket
    if (socket) {
      console.log('👋 Socket manually disconnected')
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },
}))

import { io, Socket } from 'socket.io-client'

const getSocketUrl = (): string => {
  // Use environment variable if available, otherwise default to localhost
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
}

export const createSocket = (): Socket => {
  const socketUrl = getSocketUrl()
  return io(socketUrl)
}

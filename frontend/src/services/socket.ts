import { io, Socket } from 'socket.io-client';

// Use current origin so Vite proxy routes /socket.io → backend (Docker & local dev)
const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Realtime Socket Connected to Backend:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Realtime Socket Disconnected');
    });
  }

  return socket;
};

export const joinUserRoom = (userId: string) => {
  const s = getSocket();
  if (userId) {
    s.emit('join:user', userId);
  }
};

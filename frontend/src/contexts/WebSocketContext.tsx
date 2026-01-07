import { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (channel: string, params?: any) => void;
  unsubscribe: (channel: string) => void;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const ws = useWebSocket({
    url: 'ws://localhost:3000/ws',
    onConnect: () => {
      console.log('🔌 WebSocket Provider connected');
    },
    onDisconnect: () => {
      console.log('🔌 WebSocket Provider disconnected');
    },
  });

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}

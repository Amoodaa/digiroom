/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { baseConfig } from 'baseConfig';
import { io, Socket } from 'socket.io-client';
import { SocketEventsMap } from 'digiroom-types';

const socket: Socket<SocketEventsMap> = io(`${baseConfig.API_URL}/youtube`, {
  transports: ['websocket'],
});

// type UseConnect = {
//   roomName: string;
//   userId: string;
// };

export const useConnect = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(socket.connected);
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return { socket, isConnected };
};

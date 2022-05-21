import { useEffect } from 'react';
import { baseConfig } from 'baseConfig';
import { io, Socket } from 'socket.io-client';
import { SocketEventsMap } from 'digiroom-types';

const socket: Socket<SocketEventsMap> = io(`${baseConfig.API_URL}/youtube`).connect();

export const useConnect = ({ roomId }: { roomId: string }) => {
  useEffect(() => {
    socket.emit('join-room', roomId);

    // TODO: disconnect
    return () => {
      socket.emit('leave-room', roomId);
    };
  }, [roomId]);

  return { roomConnection: socket };
};

import { useEffect, useState } from 'react';
import { baseConfig } from 'baseConfig';
import { io, Socket } from 'socket.io-client';
import { SocketEventsMap } from 'digiroom-types';

export const useConnect = ({ roomId }: { roomId: string }) => {
  const [roomConnected] = useState<Socket<SocketEventsMap>>(() => io(`${baseConfig.API_URL}/youtube`).connect());

  useEffect(() => {
    roomConnected.emit('join-room', roomId);

    // TODO: disconnect
  }, [roomConnected, roomId]);

  return { roomConnected };
};

/* eslint-disable no-console */
import { useEffect } from 'react';
import { baseConfig } from 'baseConfig';
import { io, Socket } from 'socket.io-client';
import { SocketEventsMap } from 'digiroom-types';

const socket: Socket<SocketEventsMap> = io(`${baseConfig.API_URL}/youtube`);
socket.connect();

export const useConnect = ({ roomId }: { roomId: string }) => {
  useEffect(() => {
    socket.emit('join-room', roomId);

    // TODO: disconnect
    return () => {
      socket.emit('leave-room', roomId);
    };
  }, [roomId]);

  useEffect(() => {
    const onConnect = () => {
      console.log('connected');
    };
    const onDisconnect = () => {
      console.log('connected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { roomConnection: socket };
};

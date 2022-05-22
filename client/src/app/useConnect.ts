/* eslint-disable no-console */
import { useEffect } from 'react';
import { baseConfig } from 'baseConfig';
import { io, Socket } from 'socket.io-client';
import { SocketEventsMap } from 'digiroom-types';

const socket: Socket<SocketEventsMap> = io(`${baseConfig.API_URL}/youtube`);
socket.connect();

export const useConnect = ({ roomName }: { roomName: string }) => {
  useEffect(() => {
    socket.emit('join-room', roomName);

    // TODO: disconnect
    return () => {
      socket.emit('leave-room', roomName);
    };
  }, [roomName]);

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

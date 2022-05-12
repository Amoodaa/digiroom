import { Server as SocketServer } from 'socket.io';
import { SocketEventsMap } from 'digiroom-types';
import { CREDENTIALS, ORIGIN } from '@/config';
import { Server } from 'http';

export let io: SocketServer<SocketEventsMap> = null;

export const initializeSocketIOServer = (httpServer: Server) => {
  io = new SocketServer<SocketEventsMap>(httpServer, {
    cors: {
      origin: ORIGIN,
      credentials: CREDENTIALS,
    },
  });

  const youtubeTopic = io.of('/youtube');

  youtubeTopic.on('connection', socket => {
    socket.on('join-room', roomId => {
      socket.join(roomId);

      socket.on('pause-room', () => {
        socket.to(roomId).emit('pause-room');
      });
    });
  });
};

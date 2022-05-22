import { Server as SocketServer } from 'socket.io';
import { SocketEventsMap } from 'digiroom-types';
import { CREDENTIALS, ORIGIN } from '@/config';
import { Server } from 'http';
import { RoomService } from '@/services/room.service';

export let io: SocketServer<SocketEventsMap> = null;
const roomService = new RoomService();
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
        youtubeTopic.to(roomId).emit('pause-room');
      });

      socket.on('resume-room', () => {
        youtubeTopic.to(roomId).emit('resume-room');
      });

      socket.on('change-video', async (roomId, videoId) => {
        const room = await roomService.changeCurrentVideo(roomId, videoId);
        youtubeTopic.to(roomId).emit('changed-video', room);
      });
    });

    socket.on('leave-room', roomId => {
      socket.leave(roomId);
      socket.removeAllListeners('pause-room');
      socket.removeAllListeners('resume-room');
      socket.removeAllListeners('change-video');
    });
  });
};

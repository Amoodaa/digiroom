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
    socket.on('join-room', roomName => {
      socket.join(roomName);

      socket.on('pause-room', () => {
        youtubeTopic.to(roomName).emit('pause-room');
      });

      socket.on('resume-room', () => {
        youtubeTopic.to(roomName).emit('resume-room');
      });

      socket.on('change-video', async (roomName, videoId) => {
        const room = await roomService.changeCurrentVideo(roomName, videoId);
        youtubeTopic.to(roomName).emit('changed-video', room);
      });

      socket.on('seek-video', timeInSeconds => {
        youtubeTopic.to(roomName).emit('seek-video', timeInSeconds);
      });

      socket.on('request-room-player-data', async () => {
        const connectedSockets = await youtubeTopic.to(roomName).fetchSockets();
        if (connectedSockets.length > 0) {
          socket.once('share-room-player-data', playerState => {
            youtubeTopic.to(roomName).emit('share-room-player-data', playerState);
          });
          const [firstSocket] = connectedSockets;
          firstSocket.emit('request-room-player-data');
        }
      });
    });

    socket.on('leave-room', roomName => {
      socket.leave(roomName);
      socket.removeAllListeners('pause-room');
      socket.removeAllListeners('resume-room');
      socket.removeAllListeners('change-video');
    });
  });
};

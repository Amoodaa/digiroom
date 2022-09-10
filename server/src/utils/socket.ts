import { Server as SocketServer } from 'socket.io';
import { SocketEventsMap } from 'digiroom-types';
import { CREDENTIALS, ORIGIN } from '@/config';
import { Server } from 'http';
import { roomService } from '@/services/room.service';
import { userService } from '@/services/user.service';

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
    socket.on('join-room', async (roomName, username) => {
      socket.join(roomName);
      await userService.joinRoom(roomName, username, socket.id);
      await roomService.sendMessageToRoom(roomName, {
        user: username,
        message: `${username} has joined the room`,
        type: 'action',
      });
      socket.emit('joined-room');

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
      // requesting
      socket.on('request-room-player-data', async () => {
        const connectedSockets = await youtubeTopic.to(roomName).fetchSockets();
        if (connectedSockets.length > 1) {
          const secondSocket = connectedSockets.find(e => e.id !== socket.id);

          secondSocket.emit('request-room-player-data');
        }
      });

      socket.on('share-room-player-data', playerState => {
        youtubeTopic.to(roomName).emit('share-room-player-data', playerState);
      });

      socket.on('send-message', async (roomName, message) => {
        await roomService.sendMessageToRoom(roomName, message);
        console.log('why twice');
        youtubeTopic.to(roomName).emit('receive-message', message);
      });

      socket.on('disconnect', async () => {
        const { name } = await userService.leaveRoom(roomName, socket.id);
        await roomService.sendMessageToRoom(roomName, {
          user: name,
          message: `${name} has left the room`,
          type: 'action',
        });

        socket.removeAllListeners('pause-room');
        socket.removeAllListeners('resume-room');
        socket.removeAllListeners('change-video');
        socket.removeAllListeners('seek-video');
        socket.removeAllListeners('request-room-player-data');
        socket.removeAllListeners('send-message');
        socket.removeAllListeners('disconnect');

        socket.leave(roomName);
      });
    });
  });
};

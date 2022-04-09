import App from '@/app';
import IndexRoute from '@routes/index.route';
import RoomsRoute from '@/routes/room.route';
import validateEnv from '@utils/validateEnv';
import { Server as SocketServer } from 'socket.io';
import { CREDENTIALS, ORIGIN } from './config';

validateEnv();

const app = new App([new IndexRoute(), new RoomsRoute()]);

const httpServer = app.listen();

const initializeSocketIOServer = () => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: ORIGIN,
      credentials: CREDENTIALS,
    },
  });

  io.on('connection', () => {
    console.log('a user connected');
    io.emit('pause-video', 'thank you');
  });
};

initializeSocketIOServer();

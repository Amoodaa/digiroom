import App from '@/app';
import IndexRoute from '@routes/index.route';
import RoomsRoute from '@/routes/room.route';
import validateEnv from '@utils/validateEnv';
import { initializeSocketIOServer } from './utils/socket';

validateEnv();

const app = new App([new IndexRoute(), new RoomsRoute()]);

const httpServer = app.listen();

initializeSocketIOServer(httpServer);

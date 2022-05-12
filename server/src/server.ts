import App from '@/app';
import IndexRoute from '@routes/index.route';
import RoomsRoute from '@/routes/room.route';
import validateEnv from '@utils/validateEnv';
import { initializeSocketIOServer } from './utils/socket';
import YoutubeRoute from './routes/youtube.route';

validateEnv();

const app = new App([new IndexRoute(), new RoomsRoute(), new YoutubeRoute()]);

const httpServer = app.listen();

initializeSocketIOServer(httpServer);

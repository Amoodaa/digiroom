import { Server as SocketServer } from 'socket.io';
import { SocketEventsMap } from 'digiroom-types';
import { Server } from 'http';
export declare let io: SocketServer<SocketEventsMap>;
export declare const initializeSocketIOServer: (httpServer: Server) => void;

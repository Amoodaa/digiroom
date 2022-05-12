import { baseConfig } from 'baseConfig';
import { io, Socket } from 'socket.io-client';
import { SocketEventsMap } from 'digiroom-types';

export const socketClient: Socket<SocketEventsMap> = io(baseConfig.API_URL);
socketClient.connect();

import { Room } from './server-types/room.model';
import { PlayerState } from './PlayerState';
import { Message } from './server-types/chat.model';

export type SocketEventsMap = {
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  'change-video': (roomId: string, videoId: string) => void;
  'changed-video': (room: Room) => void;
  'seek-video': (timeInSeconds: number) => void;
  'request-room-player-data': () => void;
  'share-room-player-data': (playerState: PlayerState) => void;
  'resume-room': () => void;
  'pause-room': () => void;
  'send-message': (roomName: string, message: Message) => void;
  'receive-message': (message: Message) => void;
};

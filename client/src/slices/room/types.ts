import { Room, Message } from 'digiroom-types';

export interface RoomState {
  username: string;
  userId: string;
  room: Room | null;
  messages: Message[];
  state: 'disconnected' | 'failed' | 'joining' | 'joined';
}

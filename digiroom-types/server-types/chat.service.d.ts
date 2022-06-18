import { Message } from '@/models/chat.model';
export declare class ChatService {
    sendMessageToRoom(roomName: string, message: Message): Promise<void>;
}

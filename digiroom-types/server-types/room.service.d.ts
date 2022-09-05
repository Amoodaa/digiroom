import { CreateRoomDto } from '@dtos/room.dto';
import { Room } from '@/models/room.model';
import { Chat, Message } from '@/models/chat.model';
declare class RoomService {
    findRoomById(roomId: string): Promise<Room>;
    findRoomByName(roomName: string): Promise<Room>;
    createRoom(roomData: CreateRoomDto): Promise<Room>;
    changeCurrentVideo(roomName: string, videoId: string): Promise<Room>;
    updateRoom(roomId: string, roomData: CreateRoomDto): Promise<Room>;
    deleteRoom(roomId: string): Promise<Room>;
    getChatForRoom(roomName: string): Promise<Chat>;
    sendMessageToRoom(roomName: string, message: Message): Promise<void>;
}
export declare const roomService: RoomService;
export {};

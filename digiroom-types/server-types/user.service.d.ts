import { Room, User } from '@/models/room.model';
export declare class UserService {
    addUserToRoom(roomName: string, username: string): Promise<Room>;
    joinRoom(roomName: string, userId: string, socketId: string): Promise<User>;
}
export declare const userService: UserService;

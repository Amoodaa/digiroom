import { Room } from '@/models/room.model';
export declare class CreateRoomDto implements Pick<Room, 'name'> {
    name: string;
    playlistId?: string;
    videoId?: string;
    username: string;
}

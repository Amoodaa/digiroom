import { YoutubePlaylist, YoutubePlaylistItemsSearch, YoutubeVideo } from 'youtube.ts';
declare class UserSchema {
    _id?: any;
    name: string;
    socketId?: string;
    state: 'online' | 'offline' | 'typing';
    role: 'admin' | 'guest';
    joinedAt?: Date;
}
export declare class RoomSchema {
    name: string;
    currentPlaylistItems: YoutubePlaylistItemsSearch;
    currentPlaylistInfo: YoutubePlaylist;
    currentVideoId: string;
    currentVideo: Omit<YoutubeVideo, 'statistics' | 'player'>;
    users: UserSchema[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare type Room = RoomSchema;
export declare type User = UserSchema;
export declare const RoomModel: import("@typegoose/typegoose").ReturnModelType<typeof RoomSchema, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};

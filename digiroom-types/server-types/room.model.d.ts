import { YoutubePlaylist, YoutubePlaylistItemsSearch, YoutubeVideo } from 'youtube.ts';
export declare class RoomSchema {
    name: string;
    currentPlaylistItems: YoutubePlaylistItemsSearch;
    currentPlaylistInfo: YoutubePlaylist;
    currentVideoId: string;
    currentVideo: Omit<YoutubeVideo, 'statistics' | 'player'>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare type Room = RoomSchema;
export declare const RoomModel: import("@typegoose/typegoose").ReturnModelType<typeof RoomSchema, import("@typegoose/typegoose/lib/types").BeAnObject>;

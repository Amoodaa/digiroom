import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { YoutubePlaylist, YoutubePlaylistItemsSearch, YoutubeVideo } from 'youtube.ts';

@modelOptions({ schemaOptions: { collection: 'rooms', timestamps: true } })
class RoomSchema {
  @prop({ type: String, required: true, unique: true })
  public name: string;

  @prop({ type: Object })
  public currentPlaylistItems: YoutubePlaylistItemsSearch;
  @prop({ type: Object })
  public currentPlaylistInfo: YoutubePlaylist;

  @prop({ type: String })
  public currentVideoId: string;
  @prop({ type: Object })
  public currentVideo: Omit<YoutubeVideo, 'statistics' | 'player'>;

  public createdAt?: Date;
  public updatedAt?: Date;
}

export type Room = RoomSchema;

export const RoomModel = getModelForClass(RoomSchema);

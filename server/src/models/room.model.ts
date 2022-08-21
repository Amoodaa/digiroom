import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';
import { YoutubePlaylist, YoutubePlaylistItemsSearch, YoutubeVideo } from 'youtube.ts';

class UserSchema {
  public _id?; // change the type of _id to string

  @prop({ required: true, validate: value => value.length > 0 && value.length < 30 })
  public name: string;

  @prop()
  public socketId?: string;

  @prop({ required: true, enum: ['online', 'offline', 'typing'] })
  public state: 'online' | 'offline' | 'typing';

  @prop({ required: true, enum: ['owner', 'member'] })
  public role: 'owner' | 'member';

  @prop({ default: Date.now })
  public joinedAt?: Date;
}

@modelOptions({
  schemaOptions: { collection: 'room', timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class RoomSchema {
  // think about public unlisted private rooms
  // public is promoted rooms, and you can join them without approval
  // unlisted are not promoted, you can join them without approval
  // private are not promoted, you need approval to join them

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

  @prop({ type: () => [UserSchema], default: [], _id: true })
  public users: UserSchema[];

  public createdAt?: Date;
  public updatedAt?: Date;
}

export type Room = RoomSchema;
export type User = UserSchema;

export const RoomModel = getModelForClass(RoomSchema);

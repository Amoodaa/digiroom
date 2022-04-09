import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'rooms', timestamps: true } })
class RoomSchema {
  @prop({ type: String, required: true, unique: true })
  public name: string;

  @prop({ type: String })
  public currentPlaylist: string;

  @prop({ type: String })
  public currentVideo: string;

  public createdAt?: Date;
  public updatedAt?: Date;
}

export const RoomModel = getModelForClass(RoomSchema);

export type Room = RoomSchema;

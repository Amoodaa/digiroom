import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { RoomSchema } from './room.model';

class MessageSchema {
  @prop({ required: true, enum: ['action', 'chat'] })
  public type: 'chat' | 'action';

  @prop({ required: true })
  public message: string;

  @prop({ required: true })
  public user: string;

  @prop({ default: Date.now })
  public createdAt?: Date;
}

@modelOptions({
  schemaOptions: { collection: 'chats', timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class ChatSchema {
  @prop({ required: true, unique: true, ref: () => RoomSchema })
  public room: Ref<RoomSchema>;

  @prop({ required: true, unique: true, type: () => MessageSchema })
  public messages: Message[];

  public createdAt?: Date;
  public updatedAt?: Date;
}

export type Chat = ChatSchema;
export type Message = MessageSchema;

export const ChatModel = getModelForClass(ChatSchema);

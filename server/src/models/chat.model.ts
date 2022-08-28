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
  public user: string; // reference to room.users._id

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

  @prop({ required: true, type: () => MessageSchema })
  public messages: Message[];

  public createdAt?: Date;
  public updatedAt?: Date;
}

export type Chat = ChatSchema;
export type Message = MessageSchema;

export const ChatModel = getModelForClass(ChatSchema);

// messages: [{
//   id: xdescribe,
//   user: 'id',// instead of name: Sameer
//   content:'',
// }]

// pros: of name built in messages
// we dont have to look up user names, because they are THERE
// cons:
// user cant change his name without us having to change it in all messages

// room.users: [{
//   id: 'id',
//   name: '',
//   socketId: '',
//   state: online | offline | typing
//   joinedAt: '',
// }]

// pros:
// first reason is the name is not unique, there can be 2 sameers, unless we change requirements
// id is unique, so we can use it to identify users, but the user can change the name? and we still can link the messages he wrote
// cons:
// we have to look up the name, because it is not built in message
// we have to add a state instead of just deleting user from array

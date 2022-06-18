import { Ref } from '@typegoose/typegoose';
import { RoomSchema } from './room.model';
declare class MessageSchema {
    type: 'chat' | 'action';
    message: string;
    user: string;
    createdAt?: Date;
}
declare class ChatSchema {
    room: Ref<RoomSchema>;
    messages: Message[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare type Chat = ChatSchema;
export declare type Message = MessageSchema;
export declare const ChatModel: import("@typegoose/typegoose").ReturnModelType<typeof ChatSchema, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};

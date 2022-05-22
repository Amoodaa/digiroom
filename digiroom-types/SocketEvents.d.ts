import { Room } from "./server-types/room.model";

export type SocketEventsMap = {
  "join-room": (roomId: string) => void;
  "leave-room": (roomId: string) => void;
  "change-video": (roomId: string, videoId: string) => void;
  "changed-video": (room: Room) => void;
  "resume-room": () => void;
  "pause-room": () => void;
};

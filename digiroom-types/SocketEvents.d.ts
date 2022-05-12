export type SocketEventsMap = {
  "join-room": (roomId: string) => void;
  "resume-room": () => void;
  "pause-room": () => void;
};

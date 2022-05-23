export const exampleYTUrl = 'https://www.youtube.com/watch?v=Z6w6JowO5Fw';

export type ChatMessage = {
  type: 'chat' | 'action';
  content: string;
  senderName: string;
  at: Date;
};

export const exampleChat: ChatMessage[] = [
  {
    type: 'chat',
    content: 'I didnt understand that part',
    senderName: 'Kresto',
    at: new Date(),
  },
  {
    type: 'chat',
    content: 'Lemme explain',
    senderName: 'Mighty',
    at: new Date(),
  },
  {
    type: 'action',
    content: 'drawing on the whiteboard',
    senderName: 'Sinn',
    at: new Date(),
  },
  {
    type: 'chat',
    content: 'I see now',
    senderName: 'Kresto',
    at: new Date(),
  },
];

export const BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  CREATE_ROOM: `${BASE_URL}/room`,
  GET_ROOM: (roomName: string) => `${BASE_URL}/room/${roomName}`,
  GET_CHAT: (roomName: string) => `${BASE_URL}/room/${roomName}/chat`,
  ADD_USER_TO_ROOM: (roomName: string) => `${BASE_URL}/room/${roomName}/user`,

  SEARCH_YOUTUBE: (searchTerm: string, type: string) =>
    `/youtube/search?searchTerm=${searchTerm}&type=${type}`,
};

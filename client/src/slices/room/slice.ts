import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, Message } from 'digiroom-types';
import { extraReducers } from './reducer';
import { createRoom, getRoom, getChat, addUserToRoom, joinRoom } from './thunk';
import { RoomState } from './types';

const initialState: RoomState = {
  username: localStorage.getItem('username') ?? '',
  userId: localStorage.getItem('userId') ?? '',
  room: null,
  messages: [],
  state: 'disconnected', // => joining => joined
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeCurrentVideo(
      state,
      action: PayloadAction<Pick<Room, 'currentVideoId' | 'currentVideo'>>,
    ) {
      if (!state.room) return;

      state.room = {
        ...state.room,
        ...action.payload,
      };
    },
    receiveMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    resetRoom(state) {
      state.state = 'disconnected';
      state.room = initialState.room;
      state.messages = initialState.messages;
    },
  },
  extraReducers: builder => extraReducers(builder),
});

export const roomActions = {
  ...roomSlice.actions,
  createRoom,
  getRoom,
  getChat,
  addUserToRoom,
  joinRoom,
};

export const roomReducer = roomSlice.reducer;

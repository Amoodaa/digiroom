import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createRoom, getRoom, getChat, addUserToRoom, joinRoom } from './thunk';
import { RoomState } from './types';

export const extraReducers = (builder: ActionReducerMapBuilder<RoomState>) => {
  builder.addCase(createRoom.fulfilled, (state, action) => {
    state.state = 'disconnected';
    state.room = action.payload.data;
    state.userId = action.payload.data.users[0]._id; // bc its first user its ok
  });

  builder.addCase(getRoom.fulfilled, (state, action) => {
    state.room = action.payload.data;
  });

  builder.addCase(getChat.fulfilled, (state, action) => {
    state.messages = action.payload.data.messages;
  });

  builder
    .addCase(addUserToRoom.pending, (state, action) => {
      state.username = action.meta.arg.username;
    })
    .addCase(addUserToRoom.fulfilled, (state, action) => {
      const username = action.meta.arg.username;
      state.userId =
        action.payload.data.users.find(user => user.name === username)?._id ?? '';
      state.room = action.payload.data;
    });

  builder
    .addCase(joinRoom.pending, state => {
      state.state = 'joining';
    })
    .addCase(joinRoom.fulfilled, (state, action) => {
      state.state = 'joined';
    });
};

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse, CreateRoomDto, Room, Chat } from 'digiroom-types';
import { axios } from 'utils/axios.util';
import { RootState } from 'app/store';
import { roomSlice } from './slice';

export const createRoom = createAsyncThunk(
  `${roomSlice.name}/createRoom`,
  async (payload: Omit<CreateRoomDto, 'username'>, { rejectWithValue, getState }) => {
    try {
      const username = (getState() as RootState).room.username;
      const { data } = await axios.post<ApiResponse<Room>>('/room', {
        ...payload,
        username,
      });

      const userId = data.data.users[0]._id;
      localStorage.setItem('userId', userId);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const getRoom = createAsyncThunk(
  `${roomSlice.name}/getRoom`,
  async (roomName: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<Room>>(`/room/${roomName}`);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const getChat = createAsyncThunk(
  `${roomSlice.name}/getChat`,
  async (roomName: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<Chat>>(`/room/${roomName}/chat`);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const addUserToRoom = createAsyncThunk(
  `${roomSlice.name}/addUserToRoom`,
  async (
    { roomName, username }: { roomName: string; username: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post<ApiResponse<Room>>(`/room/${roomName}/user`, {
        username,
      });

      const userId = data.data.users.find(user => user.name === username)?._id ?? '';

      localStorage.setItem('userId', userId);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const joinRoom = createAsyncThunk(
  `${roomSlice.name}/joinRoom`,
  async (
    { roomName, callback }: { roomName: string; callback: (username: string) => void },
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      const username = (getState() as RootState).room.username;

      let roomData = await dispatch(getRoom(roomName)).unwrap();

      const isUsernameMember = roomData.data.users.find(user => user.name === username);

      if (!isUsernameMember) {
        const newRoomData = await dispatch(
          addUserToRoom({ roomName, username }),
        ).unwrap();

        roomData = newRoomData;
      }

      callback(username);

      const userId = roomData.data.users.find(user => user.name === username)?._id ?? '';

      localStorage.setItem('userId', userId);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

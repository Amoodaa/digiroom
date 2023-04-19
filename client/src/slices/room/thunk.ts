import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse, CreateRoomDto, Room, Chat } from 'digiroom-types';
import { RootState } from 'app/store';
import { axios } from 'utils/axios.util';
import { API_ENDPOINTS } from 'utils/constants/endpoints.constant';

export const createRoom = createAsyncThunk(
  `${createSlice.name}/createRoom`,
  async (payload: Omit<CreateRoomDto, 'username'>, { rejectWithValue, getState }) => {
    try {
      const username = (getState() as RootState).room.username;
      const { data } = await axios.post<ApiResponse<Room>>(API_ENDPOINTS.CREATE_ROOM, {
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
  `${createSlice.name}/getRoom`,
  async (roomName: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<Room>>(
        API_ENDPOINTS.GET_ROOM(roomName),
      );

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const getChat = createAsyncThunk(
  `${createSlice.name}/getChat`,
  async (roomName: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<ApiResponse<Chat>>(
        API_ENDPOINTS.GET_CHAT(roomName),
      );

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const addUserToRoom = createAsyncThunk(
  `${createSlice.name}/addUserToRoom`,
  async (
    { roomName, username }: { roomName: string; username: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post<ApiResponse<Room>>(
        API_ENDPOINTS.ADD_USER_TO_ROOM(roomName),
        {
          username,
        },
      );

      const userId = data.data.users.find(user => user.name === username)?._id ?? '';

      localStorage.setItem('userId', userId);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const joinRoom = createAsyncThunk(
  `${createSlice.name}/joinRoom`,
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

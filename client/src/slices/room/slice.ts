import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse, CreateRoomDto, Room, Message, Chat } from 'digiroom-types';
import { axios } from 'utils/axios.util';

export interface RoomState {
  room: Room | null;
  messages: Message[];
  state: 'idle' | 'loading' | 'failed';
}

const initialState: RoomState = {
  room: null,
  messages: [],
  state: 'idle',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeCurrentVideo(state, action: PayloadAction<Room>) {
      state.room = action.payload;
    },
    receiveMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: builder => {
    builder
      .addCase(createRoom.pending, state => {
        state.state = 'loading';
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.state = 'idle';
        state.room = action.payload.data;
      });

    builder
      .addCase(getRoom.pending, state => {
        state.state = 'loading';
      })
      .addCase(getRoom.fulfilled, (state, action) => {
        state.state = 'idle';
        state.room = action.payload.roomData.data;
        state.messages = action.payload.chatData.data.messages;
      });
  },
});

const createRoom = createAsyncThunk(
  `${roomSlice.name}/createRoom`,
  async (payload: CreateRoomDto, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiResponse<Room>>('/room', payload);
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const getRoom = createAsyncThunk(
  `${roomSlice.name}/getRoom`,
  async ({ roomName }: { roomName: string }, { rejectWithValue }) => {
    try {
      const roomPromise = axios.get<ApiResponse<Room>>(`/room/${roomName}`);
      const chatPromise = axios.get<ApiResponse<Chat>>(`/room/${roomName}/chat`);

      const [{ data: roomData }, { data: chatData }] = await Promise.all([
        roomPromise,
        chatPromise,
      ]);

      return { roomData, chatData };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const roomActions = { ...roomSlice.actions, createRoom, getRoom };

export const roomReducer = roomSlice.reducer;

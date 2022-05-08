import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiError, ApiResponse, CreateRoomDto, Room } from 'digiroom-types';
import { axios } from 'utils/axios.util';

export interface RoomState {
  room: Room | null;
  state: 'idle' | 'loading' | 'failed';
}

const initialState: RoomState = {
  room: null,
  state: 'idle',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
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
        state.room = action.payload.data;
      });
  },
});

const createRoom = createAsyncThunk(`${roomSlice.name}/createRoom`, async (payload: CreateRoomDto, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<ApiResponse<Room>>('/room', payload);
    return data;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const getRoom = createAsyncThunk(`${roomSlice.name}/getRoom`, async ({ roomId }: { roomId: string }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ApiResponse<Room>>(`/room/${roomId}`);
    return data;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const roomActions = { ...roomSlice.actions, createRoom, getRoom };

export const roomReducer = roomSlice.reducer;

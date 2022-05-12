import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { roomReducer } from 'slices/room/slice';
import { searchReducer } from 'slices/search/slice';
import { snackbarReducer } from 'slices/snackbar/slice';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    snackbar: snackbarReducer,
    search: searchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

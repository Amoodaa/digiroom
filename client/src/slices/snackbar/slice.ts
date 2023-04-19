import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarKey } from 'notistack';
import { extraReducers } from './reducer';
import { ContainerState, SnackObjectAction } from './types';

// The initial state of the Snackbar container
export const initialState: ContainerState = { snacks: {} };

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    enqueueSnackbar(state, action: PayloadAction<SnackObjectAction>) {
      const {
        dismissed = false,
        message,
        // displayed = false,
        key = `${new Date().getTime()}${Math.random().toFixed(2)}`,
        options = {},
      } = action.payload;

      state.snacks[key] = { dismissed, message, key, options };
    },
    closeSnackbar(state, action: PayloadAction<SnackbarKey>) {
      if (state.snacks?.[action.payload]) state.snacks[action.payload].dismissed = true;
    },
    removeSnackbar(state, action: PayloadAction<SnackbarKey>) {
      if (state.snacks?.[action.payload]) delete state.snacks[action.payload];
    },
  },
  extraReducers: builder => extraReducers(builder),
});

export const snackbarActions = { ...snackbarSlice.actions };

export const snackbarReducer = snackbarSlice.reducer;

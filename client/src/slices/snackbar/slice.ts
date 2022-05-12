import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { UnknownAsyncThunkRejectedAction } from '@reduxjs/toolkit/dist/matchers';
import { AxiosError } from 'axios';
import { ApiError } from 'digiroom-types';
import { SnackbarKey } from 'notistack';
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
  extraReducers: builder => {
    builder.addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action: UnknownAsyncThunkRejectedAction) => {
        console.log(action.payload);
        const error = action.payload as AxiosError<ApiError>;
        const defaultError = { data: { message: 'Network problem probably, if not, contact dev' } };
        if (error.isAxiosError) {
          const message = (error.response ?? defaultError).data.message;
          state.snacks[message] = {
            dismissed: false,
            message: message,
            key: message,
            options: {
              variant: 'error',
            },
          };
        } else {
          const key = error.message;
          state.snacks[key] = {
            dismissed: false,
            message: 'contact the developer, error: ' + error.message,
            key: key,
            options: {
              variant: 'error',
            },
          };
        }
      },
    );
  },
});

export const snackbarActions = { ...snackbarSlice.actions };

export const snackbarReducer = snackbarSlice.reducer;

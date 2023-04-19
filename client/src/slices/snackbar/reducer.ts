import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { UnknownAsyncThunkRejectedAction } from '@reduxjs/toolkit/dist/matchers';
import { AxiosError } from 'axios';
import { ApiError } from 'digiroom-types';
import { SnackbarState } from './types';

export const extraReducers = (builder: ActionReducerMapBuilder<SnackbarState>) => {
  builder.addMatcher(
    action => action.type.endsWith('/rejected'),
    (state, action: UnknownAsyncThunkRejectedAction) => {
      const error = action.payload as AxiosError<ApiError>;
      const defaultError = {
        data: { message: 'Network problem probably, if not, contact dev' },
      };
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
};

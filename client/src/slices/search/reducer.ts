import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { searchYoutube } from './thunk';
import { SearchState } from './types';

export const extraReducers = (builder: ActionReducerMapBuilder<SearchState>) => {
  builder
    .addCase(searchYoutube.pending, state => {
      state.state = 'loading';
    })
    .addCase(searchYoutube.fulfilled, (state, action) => {
      state.state = 'idle';
      state.youtubeSearchResult = action.payload.data;
    });
};

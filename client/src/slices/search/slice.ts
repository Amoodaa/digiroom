import { createSlice } from '@reduxjs/toolkit';
import { extraReducers } from './reducer';
import { searchYoutube } from './thunk';
import { SearchState } from './types';

const initialState: SearchState = {
  youtubeSearchResult: null,
  state: 'idle',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: builder => extraReducers(builder),
});

export const searchActions = { ...searchSlice.actions, searchYoutube };

export const searchReducer = searchSlice.reducer;

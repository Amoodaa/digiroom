import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ApiError, ApiResponse } from 'digiroom-types';
import { axios } from 'utils/axios.util';
import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';

export interface SearchState {
  youtubeSearchResult: YoutubeVideoSearch | YoutubePlaylistSearch | null;
  state: 'idle' | 'loading' | 'failed';
}

const initialState: SearchState = {
  youtubeSearchResult: null,
  state: 'idle',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: builder => {
    builder
      .addCase(searchYoutube.pending, state => {
        state.state = 'loading';
      })
      .addCase(searchYoutube.fulfilled, (state, action) => {
        state.state = 'idle';
        state.youtubeSearchResult = action.payload.data;
      });
  },
});

export type YoutubeSearchForm = { searchTerm: string; type: 'playlists' | 'videos' };

const searchYoutube = createAsyncThunk(
  `${searchSlice.name}/searchYoutube`,
  async ({ searchTerm, type }: YoutubeSearchForm, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<
        ApiResponse<YoutubeVideoSearch | YoutubePlaylistSearch>
      >(`/youtube/search?searchTerm=${searchTerm}&type=${type}`);
      return data;
    } catch (e) {
      return rejectWithValue(e as ApiError);
    }
  },
);

export const searchActions = { ...searchSlice.actions, searchYoutube };

export const searchReducer = searchSlice.reducer;

import { createAsyncThunk } from '@reduxjs/toolkit';
import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';
import { ApiError, ApiResponse } from 'digiroom-types';
import { axios } from 'utils/axios.util';
import { searchSlice } from './slice';
import { YoutubeSearchForm } from './types';

export const searchYoutube = createAsyncThunk(
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

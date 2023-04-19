import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';
import { ApiError, ApiResponse } from 'digiroom-types';
import { axios } from 'utils/axios.util';
import { API_ENDPOINTS } from 'utils/constants/endpoints.constant';
import { YoutubeSearchForm } from './types';

export const searchYoutube = createAsyncThunk(
  `${createSlice.name}/searchYoutube`,
  async ({ searchTerm, type }: YoutubeSearchForm, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<
        ApiResponse<YoutubeVideoSearch | YoutubePlaylistSearch>
      >(API_ENDPOINTS.SEARCH_YOUTUBE(searchTerm, type));
      return data;
    } catch (e) {
      return rejectWithValue(e as ApiError);
    }
  },
);

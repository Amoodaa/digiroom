import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';

export interface SearchState {
  youtubeSearchResult: YoutubeVideoSearch | YoutubePlaylistSearch | null;
  state: 'idle' | 'loading' | 'failed';
}

export type YoutubeSearchForm = { searchTerm: string; type: 'playlists' | 'videos' };

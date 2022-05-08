import { YOUTUBE_API_KEY } from '@/config';
import Youtube from 'youtube.ts';

export const youtubeClient = new Youtube(YOUTUBE_API_KEY);

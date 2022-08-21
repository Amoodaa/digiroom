import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';
declare class YoutubeService {
    searchYoutube(searchTerm: string, { type }: {
        type: string;
    }): Promise<YoutubePlaylistSearch | YoutubeVideoSearch>;
}
export declare const youtubeService: YoutubeService;
export {};

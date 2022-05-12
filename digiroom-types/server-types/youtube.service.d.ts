import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';
export declare class YoutubeService {
    searchYoutube(searchTerm: string, { type }: {
        type: string;
    }): Promise<YoutubePlaylistSearch | YoutubeVideoSearch>;
}

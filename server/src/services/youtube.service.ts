import { HttpError } from '@/exceptions/HttpError';
import { isEmpty } from '@utils/util';
import { youtubeClient } from '@/utils/youtube';
import { YoutubePlaylistSearch, YoutubeVideoSearch } from 'youtube.ts';

export class YoutubeService {
  public async searchYoutube(searchTerm: string, { type }: { type: string }): Promise<YoutubePlaylistSearch | YoutubeVideoSearch> {
    if (isEmpty(searchTerm)) throw new HttpError(400, 'No search term provided');

    if (!(type === 'playlists' || type === 'videos')) throw new HttpError(400, 'Only supported searches are "playlists" and "videos"');

    const typeSource = youtubeClient[type];
    const youtubeSearch = await typeSource.search({
      part: 'snippet',
      q: searchTerm,
    });

    return youtubeSearch;
  }
}

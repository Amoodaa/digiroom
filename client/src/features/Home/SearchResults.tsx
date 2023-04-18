import { FC } from 'react';
import { YoutubePlaylistSearchItem, YoutubeVideoSearchItem } from 'youtube.ts';
import urlParser from 'js-video-url-parser';
import { VideoInfo } from 'js-video-url-parser/lib/urlParser';
import { useAppSelector } from 'app/hooks';
import { examplePlaylistSearch } from './data';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from 'components/MaterialUI';

const isYoutubeVideoId = (
  id: (YoutubeVideoSearchItem | YoutubePlaylistSearchItem)['id'],
): id is YoutubeVideoSearchItem['id'] => id.kind === 'youtube#video';

export const SearchResults: FC<{ onYoutubeClick: (youtubeUrl: string) => void }> = ({
  onYoutubeClick,
}) => {
  const searchResults =
    useAppSelector(s => s.search.youtubeSearchResult) ?? examplePlaylistSearch;

  const handleVideoCardClick = (id: YoutubeVideoSearchItem['id']) => {
    const { videoId } = id;
    const url = urlParser.create({
      videoInfo: {
        id: videoId,
        mediaType: 'video',
        provider: 'youtube',
      },
      format: 'long',
    });
    if (url) {
      onYoutubeClick(url);
    }

    // TODO: error handling/report to dev?? could be just dumb typing
  };

  const handlePlaylistCardClick = ({ playlistId }: YoutubePlaylistSearchItem['id']) => {
    const url = urlParser.create({
      videoInfo: {
        id: playlistId,
        list: playlistId,
        provider: 'youtube',
        mediaType: 'playlist',
      } as VideoInfo,
      format: 'long',
    });

    if (url) {
      onYoutubeClick(url);
    }
  };

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      {searchResults.items.map(
        ({ id, snippet: { thumbnails, description, title, channelTitle } }) => (
          <Card
            sx={{
              width: 320,
              m: 2,
            }}
            key={isYoutubeVideoId(id) ? id.videoId : id.playlistId}
          >
            <CardMedia
              component="img"
              height="140"
              image={thumbnails.high.url}
              alt={title}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'calc(100% - 140px)',
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {channelTitle}
                </Typography>
                {description && (
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    isYoutubeVideoId(id)
                      ? handleVideoCardClick(id)
                      : handlePlaylistCardClick(id)
                  }
                >
                  Start this course!
                </Button>
              </CardActions>
            </Box>
          </Card>
        ),
      )}
    </Box>
  );
};

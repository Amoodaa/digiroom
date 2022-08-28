import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { examplePlaylistSearch } from './data';
import { useAppSelector } from 'app/hooks';
import { YoutubePlaylistSearchItem, YoutubeVideoSearchItem } from 'youtube.ts';
import urlParser from 'js-video-url-parser';
import { VideoInfo } from 'js-video-url-parser/lib/urlParser';

const isYoutubeVideoId = (
  id: (YoutubeVideoSearchItem | YoutubePlaylistSearchItem)['id'],
): id is YoutubeVideoSearchItem['id'] => id.kind === 'youtube#video';

export const SearchResults: FC<{ onYoutubeClick: (youtubeUrl: string) => void }> = ({
  onYoutubeClick,
}) => {
  const searchResults =
    useAppSelector(s => s.search.youtubeSearchResult) ?? examplePlaylistSearch;

  const handleCardClick = (
    id: (YoutubeVideoSearchItem | YoutubePlaylistSearchItem)['id'],
  ) => {
    if (isYoutubeVideoId(id)) {
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
    } else {
      const { playlistId } = id;
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
    }
    // TODO: error handling/report to dev?? could be just dumb typing
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
                <Button onClick={() => handleCardClick(id)}>Start this course!</Button>
              </CardActions>
            </Box>
          </Card>
        ),
      )}
    </Box>
  );
};

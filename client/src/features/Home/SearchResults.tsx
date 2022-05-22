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
import { YoutubePlaylistSearch } from 'youtube.ts';
import urlParser, { YouTubeMediaTypes } from 'js-video-url-parser';
import { VideoInfo } from 'js-video-url-parser/lib/urlParser';

export const SearchResults: FC<{ onYoutubeClick: (youtubeUrl: string) => void }> = ({ onYoutubeClick }) => {
  const searchResults = (useAppSelector(s => s.search.youtubeSearchResult) as YoutubePlaylistSearch) ?? examplePlaylistSearch;
  const handleCardClick = ({ id, list, kind }: Record<'id' | 'list' | 'kind', string>) => {
    const mediaTypes: Record<string, YouTubeMediaTypes> = {
      'youtube#playlist': 'playlist',
      'youtube#video': 'video',
    };
    const mediaType = mediaTypes[kind];

    const url = urlParser.create({
      videoInfo: {
        id,
        list,
        mediaType,
        provider: 'youtube',
      } as VideoInfo,
      format: 'long',
    });

    if (url) {
      onYoutubeClick(url);
    }
    // TODO: error handling/report to dev?? could be just dumb typing
  };
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      {searchResults.items.map(({ id: { playlistId, kind }, snippet: { thumbnails, description, title, channelTitle } }) => (
        <Card
          sx={{
            width: 320,
            m: 2,
          }}
          key={kind + playlistId}
        >
          <CardMedia component="img" height="140" image={thumbnails.high.url} alt={title} />
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
              <Button onClick={() => handleCardClick({ id: '', list: playlistId, kind })}>Start this course!</Button>
            </CardActions>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

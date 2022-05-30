import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Room } from 'digiroom-types';

const Widget = styled('div')(({ theme }) => ({
  borderRadius: 16,
  minWidth: 450,
  maxWidth: '100%',
  margin: 'auto',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
}));

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

type Props = {
  currentVideo: Room['currentVideo'];
  currentTime: number;
  playing: boolean;
  duration: number;
  volume: number;
  onPlayClick: () => void;
  onVolumeChange: (value: number) => void;
  onSeek: (value: number) => void;
  onNextClick: () => void;
  onPrevClick: () => void;
  onSyncClick: () => void;
};

function formatDuration(value: number) {
  const minute = Math.floor(value / 60);
  const secondLeft = value - minute * 60;
  return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
}

export const Controls: React.FC<Props> = ({
  currentVideo,
  currentTime,
  playing,
  onPlayClick,
  volume,
  onVolumeChange,
  duration,
  onSeek,
  onNextClick,
  onPrevClick,
  onSyncClick,
}) => {
  const theme = useTheme();

  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const mainIconColor = theme.palette.mode === 'dark' ? '#fffffff0' : 'rgba(0,0,0,0.4)';

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {currentVideo.snippet.channelTitle}
            </Typography>
            <Typography noWrap>
              <b>{currentVideo.snippet.title}</b>
            </Typography>
          </Box>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={currentTime}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => onSeek(Array.isArray(value) ? value[0] : value)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(currentTime)}</TinyText>
          <TinyText>-{formatDuration(duration - currentTime)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <IconButton aria-label="mute video">
            <VolumeOffIcon fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label="previous song" onClick={onPrevClick}>
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label={playing ? 'play' : 'pause'} onClick={onPlayClick}>
            {playing ? (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            ) : (
              <PlayArrowRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton aria-label="next song" onClick={onNextClick}>
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label="sync" onClick={onSyncClick}>
            <CloudSyncIcon fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            value={volume}
            onChangeCommitted={(_, value) => onVolumeChange(value as number)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&:before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
    </Box>
  );
};

import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector, useConnect } from 'app/hooks';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useParams } from 'react-router';
import urlParser from 'js-video-url-parser';

import { Header } from '../../components/Header';
import { ChatMessage as IChatMessage, exampleChat } from './data';
import { roomActions } from 'slices/room/slice';
import { Button } from '@mui/material';
import { Room } from 'digiroom-types';
import { PlayerState } from 'digiroom-types/PlayerState';
import LinearProgress from '@mui/material/LinearProgress';

export const ChatMessage: FC<{ chatItem: IChatMessage }> = ({ chatItem }) => (
  <Typography>
    [{chatItem.at.toLocaleTimeString()}] {chatItem.senderName}
    {chatItem.type === 'chat' ? ': ' : ' '}
    {chatItem.content}
  </Typography>
);

export const RoomPage = () => {
  const dispatch = useAppDispatch();
  const { roomName = '' } = useParams<{ roomName: string }>();
  const { roomConnection } = useConnect({ roomName });
  const youtubePlayer = useRef<ReactPlayer | null>(null);
  const room = useAppSelector(s => s.room.room);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(true);
  const currentVideoId = useAppSelector(s => s.room.room?.currentVideoId) ?? '';
  const currentVideoUrl = urlParser.create({
    videoInfo: {
      id: currentVideoId,
      mediaType: 'video',
      provider: 'youtube',
    },
  });

  useEffect(() => {
    dispatch(roomActions.getRoom({ roomName }));
  }, [dispatch, roomName]);

  const roomInit = () => {
    roomConnection.emit('request-room-player-data');
  };

  const pausePlaying = useCallback(() => setPlaying(false), []);

  const onPauseClick = useCallback(() => {
    roomConnection.emit('pause-room');
    pausePlaying();
  }, [pausePlaying, roomConnection]);

  const resumePlaying = useCallback(() => setPlaying(true), []);

  const onPlayClick = useCallback(() => {
    roomConnection.emit('resume-room');
    resumePlaying();
  }, [resumePlaying, roomConnection]);

  const changeVideo = useCallback((room: Room) => dispatch(roomActions.changeCurrentVideo(room)), [dispatch]);

  const onNextClick = useCallback(() => {
    if (!room) return;
    const currentVideoIndex = room.currentPlaylistItems.items.findIndex(e => e.contentDetails.videoId === room.currentVideoId);
    roomConnection.emit('change-video', roomName, room.currentPlaylistItems.items[currentVideoIndex + 1].contentDetails.videoId);
  }, [room, roomConnection, roomName]);

  const seekVideo = useCallback((timeInSeconds: number) => youtubePlayer.current?.seekTo(timeInSeconds, 'seconds'), []);

  const onSeek = useCallback(
    (seekTo: number) => {
      roomConnection.emit('seek-video', seekTo);
    },
    [roomConnection],
  );

  useEffect(() => {
    const roomInitRequest = () => {
      roomConnection.emit('share-room-player-data', { currentTime: youtubePlayer.current?.getCurrentTime() ?? 0 });
    };

    const roomInit = ({ currentTime }: PlayerState) => {
      seekVideo(currentTime);
    };

    roomConnection.on('resume-room', resumePlaying);
    roomConnection.on('pause-room', pausePlaying);
    roomConnection.on('changed-video', changeVideo);
    roomConnection.on('seek-video', seekVideo);
    roomConnection.on('request-room-player-data', roomInitRequest);
    roomConnection.on('share-room-player-data', roomInit);

    return () => {
      roomConnection.off('resume-room', resumePlaying);
      roomConnection.off('pause-room', pausePlaying);
      roomConnection.off('changed-video', changeVideo);
      roomConnection.off('seek-video', seekVideo);
      roomConnection.off('request-room-player-data', roomInitRequest);
      roomConnection.off('share-room-player-data', roomInit);
    };
  }, [roomConnection.connected, roomConnection, roomName, pausePlaying, resumePlaying, changeVideo, seekVideo]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (youtubePlayer.current) {
        setCurrentTime(youtubePlayer.current.getCurrentTime());
        setCurrentTime(youtubePlayer.current.getSecondsLoaded());
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const progressValue = (currentTime / (youtubePlayer.current?.getDuration() ?? 1)) * 100;
  const bufferValue = (currentTime / (youtubePlayer.current?.getDuration() ?? 1)) * 100;

  return (
    <>
      <Header roomName={roomName} />
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <Box maxWidth="50%" sx={{ p: 2 }}>
          <ReactPlayer url={currentVideoUrl} onReady={roomInit} ref={youtubePlayer} playing={playing} muted={muted} config={{}} />
          <Divider sx={{ my: 2 }} />
          <Paper variant="outlined">
            <Box display="flex" flexDirection="column" justifyContent="flex-end" height="40vh" p={2}>
              <Box mb={3}>
                {exampleChat.map(msg => (
                  <ChatMessage chatItem={msg} key={JSON.stringify(msg)} />
                ))}
              </Box>

              <TextField
                sx={{ justifySelf: 'flex-end' }}
                placeholder="Send a message"
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <IconButton color="primary">
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Box>
        <Button onClick={playing ? onPauseClick : onPlayClick}>{playing ? 'Pause' : 'Play'}</Button>
        <Button onClick={onNextClick}>{'Next Song'}</Button>
        <Button onClick={() => setMuted(!muted)}>{muted ? 'unmute' : 'mute'}</Button>
        <Button onClick={() => onSeek(1)}>{'Seek to 00:01'}</Button>
        <LinearProgress
          onClick={e => {
            console.log(e);
          }}
          variant="buffer"
          value={progressValue}
          valueBuffer={bufferValue}
        />
        <h1>{playing + ''}</h1>
        <pre>{JSON.stringify(room, null, 2)}</pre>
      </Container>
    </>
  );
};

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

export const ChatMessage: FC<{ chatItem: IChatMessage }> = ({ chatItem }) => (
  <Typography>
    [{chatItem.at.toLocaleTimeString()}] {chatItem.senderName}
    {chatItem.type === 'chat' ? ': ' : ' '}
    {chatItem.content}
  </Typography>
);

export const Room = () => {
  const dispatch = useAppDispatch();
  const { roomId = '' } = useParams<{ roomId: string }>();
  const { roomConnection } = useConnect({ roomId });
  const youtubePlayer = useRef<ReactPlayer | null>(null);
  const room = useAppSelector(s => s.room.room);
  const [playing, setPlaying] = useState(true);
  const currentVideoId = useAppSelector(s => s.room.room?.currentVideoId) ?? '';
  const currentVideoUrl = urlParser.create({
    videoInfo: {
      id: currentVideoId,
      mediaType: 'video',
      provider: 'youtube',
    },
  });

  useEffect(() => {
    dispatch(roomActions.getRoom({ roomId }));
  }, [dispatch, roomId]);

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

  useEffect(() => {
    if (!roomConnection.connected) return;

    roomConnection.on('resume-room', resumePlaying);
    roomConnection.on('pause-room', pausePlaying);

    return () => {
      roomConnection.removeListener('resume-room', resumePlaying);
      roomConnection.removeListener('pause-room', pausePlaying);
    };
  }, [roomConnection.connected, roomConnection, roomId, pausePlaying, resumePlaying]);

  return (
    <>
      <Header roomId={roomId} />
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <Box maxWidth="50%" sx={{ p: 2 }}>
          <ReactPlayer url={currentVideoUrl} ref={youtubePlayer} playing={playing} muted config={{}} />
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
        <h1>{playing + ''}</h1>
        <pre>{JSON.stringify(room, null, 2)}</pre>
      </Container>
    </>
  );
};

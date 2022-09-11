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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Header } from '../../components/Header';
import { roomActions } from 'slices/room/slice';
import { Breakpoint, Button } from '@mui/material';
import { Message, Room, SocketEventsMap } from 'digiroom-types';
import { Controls } from './Controls';
import { parse, toSeconds } from 'iso8601-duration';
import { useForm } from 'react-hook-form';

export const ChatMessage: FC<{ chatItem: Message }> = ({ chatItem }) => (
  <Typography>
    {chatItem.createdAt && `[${new Date(chatItem.createdAt).toLocaleTimeString()}]`}{' '}
    {chatItem.type === 'chat' ? `${chatItem.user}: ` : ' '}
    {chatItem.message}
  </Typography>
);

export const RoomPage = () => {
  const dispatch = useAppDispatch();

  // room state
  const { roomName = '' } = useParams<{ roomName: string }>();
  const { userId, messages, room, username } = useAppSelector(s => s.room);
  const { roomConnection, isConnected } = useConnect({ roomName, userId });

  // player state
  const youtubePlayer = useRef<ReactPlayer | null>(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const currentVideoId = room?.currentVideoId ?? '';
  const currentVideoUrl = urlParser.create({
    videoInfo: {
      id: currentVideoId,
      mediaType: 'video',
      provider: 'youtube',
    },
  });

  // Bunch of event handlers both socket responsive and user actions
  const roomSync = () => {
    roomConnection.emit('request-room-player-data');
  };

  const [volume, setVolume] = useState(0);

  const onVolumeChange = useCallback((volume: number) => setVolume(volume), []);

  useEffect(() => {
    youtubePlayer.current?.getInternalPlayer()?.setVolume?.(volume);
  }, [volume]);

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

  const changedVideoEvent = useCallback(
    (changedVideoPayload: Pick<Room, 'currentVideoId' | 'currentVideo'>) =>
      dispatch(roomActions.changeCurrentVideo(changedVideoPayload)),
    [dispatch],
  );

  const changeVideo = useCallback(
    (videoId: string) => roomConnection.emit('change-video', roomName, videoId),
    [roomConnection, roomName],
  );

  const onPrevClick = useCallback(() => {
    if (!room) return;
    const currentVideoIndex = room.currentPlaylistItems.items.findIndex(
      e => e.contentDetails.videoId === room.currentVideoId,
    );
    // if first item in array, then dont do it
    const prevVideoIndex = currentVideoIndex - 1 >= 0 ? currentVideoIndex - 1 : 0;
    const videoId =
      room.currentPlaylistItems.items[prevVideoIndex].contentDetails.videoId;
    if (videoId !== currentVideoId) {
      changeVideo(videoId);
    }
  }, [changeVideo, currentVideoId, room]);

  const onNextClick = useCallback(() => {
    if (!room) return;
    const currentVideoIndex = room.currentPlaylistItems.items.findIndex(
      e => e.contentDetails.videoId === room.currentVideoId,
    );
    const nextVideoIndex =
      // if last item in array, then dont do it
      currentVideoIndex + 1 < room.currentPlaylistItems.items.length
        ? currentVideoIndex + 1
        : room.currentPlaylistItems.items.length;
    const videoId =
      room.currentPlaylistItems.items[nextVideoIndex].contentDetails.videoId;

    if (videoId !== currentVideoId) {
      changeVideo(videoId);
    }
  }, [changeVideo, currentVideoId, room]);

  const seekVideo = useCallback(
    (timeInSeconds: number) => youtubePlayer.current?.seekTo(timeInSeconds, 'seconds'),
    [],
  );

  const onSeek = useCallback(
    (seekTo: number) => {
      roomConnection.emit('seek-video', seekTo);
    },
    [roomConnection],
  );

  // state validators
  useEffect(() => {
    if (isConnected && username) {
      dispatch(
        roomActions.joinRoom({
          roomName,
          username,
          joinRoomFn: (roomName, username) =>
            roomConnection.emit('join-room', roomName, username),
        }),
      );
    }
  }, [dispatch, isConnected, roomConnection, roomName, username]);

  // socket events setup and teardown
  useEffect(() => {
    if (isConnected) {
      const shareRoomState = () => {
        roomConnection.emit('share-room-player-data', {
          currentTime: youtubePlayer.current?.getCurrentTime() ?? 0,
        });
      };

      const processRoomState: SocketEventsMap['share-room-player-data'] = ({
        currentTime,
      }) => {
        seekVideo(currentTime);
      };

      const receiveMessage: SocketEventsMap['receive-message'] = message => {
        dispatch(roomActions.receiveMessage(message));
      };

      const getRoom: SocketEventsMap['joined-room'] = () => {
        dispatch(roomActions.getRoom({ roomName }));
      };

      roomConnection.on('joined-room', getRoom);
      roomConnection.on('resume-room', resumePlaying);
      roomConnection.on('pause-room', pausePlaying);
      roomConnection.on('changed-video', changedVideoEvent);
      roomConnection.on('seek-video', seekVideo);
      roomConnection.on('request-room-player-data', shareRoomState);
      roomConnection.on('share-room-player-data', processRoomState);
      roomConnection.on('receive-message', receiveMessage);

      return () => {
        roomConnection.off('joined-room', getRoom);
        roomConnection.off('resume-room', resumePlaying);
        roomConnection.off('pause-room', pausePlaying);
        roomConnection.off('changed-video', changedVideoEvent);
        roomConnection.off('seek-video', seekVideo);
        roomConnection.off('request-room-player-data', shareRoomState);
        roomConnection.off('share-room-player-data', processRoomState);
        roomConnection.off('receive-message', receiveMessage);
      };
    }
  }, [
    changedVideoEvent,
    dispatch,
    roomName,
    isConnected,
    pausePlaying,
    resumePlaying,
    roomConnection,
    seekVideo,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (youtubePlayer.current) {
        setCurrentTime(youtubePlayer.current.getCurrentTime());
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const { handleSubmit, register } = useForm<{ messageText: string }>();

  const muted = volume === 0;
  if (!room) return null;

  return (
    <>
      <Header roomName={roomName} />
      <Container
        maxWidth={'xxl' as Breakpoint}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { sm: 'column', lg: 'row' },
          height: '95vh',
        }}
      >
        <Box p={2} width="75%" position="relative">
          <ReactPlayer
            url={currentVideoUrl}
            onReady={roomSync}
            ref={youtubePlayer}
            playing={playing}
            volume={volume}
            muted={muted}
            width="100%"
            height="calc(100%)"
          />
          <Box
            height="calc(100%)"
            position="absolute"
            top="0"
            width="100%"
            onClick={playing ? onPauseClick : onPlayClick}
          />
          <Divider sx={{ my: 2 }} />
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
          maxHeight="90vh"
        >
          <Box
            sx={{
              height: '20vh',
              width: '90%',
            }}
          >
            <Controls
              currentVideo={room.currentVideo}
              playing={playing}
              volume={volume}
              currentTime={Math.round(currentTime)}
              duration={toSeconds(parse(room.currentVideo.contentDetails.duration))}
              onSyncClick={roomSync}
              onPlayClick={playing ? onPauseClick : onPlayClick}
              onVolumeChange={onVolumeChange}
              onSeek={value => onSeek(value)}
              onNextClick={onNextClick}
              onPrevClick={onPrevClick}
            />
          </Box>
          <Accordion
            sx={{
              width: '100%',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Current playlist</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                width: '100%',
                maxHeight: '50vh',
                overflow: 'scroll',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                }}
              >
                {room.currentPlaylistItems &&
                  room.currentPlaylistItems.items.map(e => (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                      key={e.id}
                    >
                      <Typography>{e.snippet.title}</Typography>
                      <Button onClick={() => changeVideo(e.contentDetails.videoId)}>
                        Change Video
                      </Button>
                    </Box>
                  ))}
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            defaultExpanded
            sx={{
              width: '100%',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Chat</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  p={2}
                  component="form"
                >
                  <Box
                    mb={3}
                    maxHeight="25vh"
                    sx={{
                      overflowY: 'scroll',
                    }}
                  >
                    {messages.map(msg => (
                      <ChatMessage chatItem={msg} key={JSON.stringify(msg)} />
                    ))}
                  </Box>

                  <TextField
                    sx={{ justifySelf: 'flex-end' }}
                    placeholder="Send a message"
                    variant="standard"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          color="primary"
                          onClick={handleSubmit(formdata => {
                            roomConnection.emit('send-message', roomName, {
                              message: formdata.messageText,
                              user: username,
                              type: 'chat',
                            });
                          })}
                        >
                          <SendIcon />
                        </IconButton>
                      ),
                    }}
                    {...register('messageText')}
                  />
                </Box>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </>
  );
};

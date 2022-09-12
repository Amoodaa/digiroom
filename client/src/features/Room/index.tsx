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
import { roomActions } from 'slices/room/slice';
import { Breakpoint, Button, Tab, Tabs } from '@mui/material';
import { Message, Room, SocketEventsMap } from 'digiroom-types';
import { Controls } from './Controls';
import { parse, toSeconds } from 'iso8601-duration';
import { useForm } from 'react-hook-form';

export const ChatMessage: FC<{ chatItem: Message }> = ({ chatItem }) => (
  <Typography sx={{ overflowWrap: 'anywhere' }}>
    {chatItem.createdAt && `[${new Date(chatItem.createdAt).toLocaleTimeString()}]`}{' '}
    {chatItem.type === 'chat' ? `${chatItem.user}: ` : ' '}
    {chatItem.message}
  </Typography>
);

export const RoomPage = () => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'chat' | 'playlist'>('chat');
  // room state
  const { roomName = '' } = useParams<{ roomName: string }>();
  const { messages, room, username } = useAppSelector(s => s.room);
  const { socket, isConnected } = useConnect();

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
    socket.emit('request-room-player-data');
  };

  const [volume, setVolume] = useState(0);

  const onVolumeChange = useCallback((volume: number) => setVolume(volume), []);

  useEffect(() => {
    youtubePlayer.current?.getInternalPlayer()?.setVolume?.(volume);
  }, [volume]);

  const pausePlaying = useCallback(() => setPlaying(false), []);

  const onPauseClick = useCallback(() => {
    socket.emit('pause-room');
    pausePlaying();
  }, [pausePlaying, socket]);

  const resumePlaying = useCallback(() => setPlaying(true), []);

  const onPlayClick = useCallback(() => {
    socket.emit('resume-room');
    resumePlaying();
  }, [resumePlaying, socket]);

  const changedVideoEvent = useCallback(
    (changedVideoPayload: Pick<Room, 'currentVideoId' | 'currentVideo'>) => {
      setCurrentTime(0);
      dispatch(roomActions.changeCurrentVideo(changedVideoPayload));
    },
    [dispatch],
  );

  const changeVideo = useCallback(
    (videoId: string) => socket.emit('change-video', roomName, videoId),
    [socket, roomName],
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
      socket.emit('seek-video', seekTo);
    },
    [socket],
  );

  // state validators
  useEffect(() => {
    if (isConnected && username) {
      dispatch(
        roomActions.joinRoom({
          roomName,
          callback: username => socket.emit('join-room', roomName, username),
        }),
      );
    }
  }, [dispatch, isConnected, socket, roomName, username]);

  // socket events setup and teardown
  useEffect(() => {
    if (isConnected) {
      const shareRoomState = () => {
        socket.emit('share-room-player-data', {
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
        // dispatch(roomActions.getRoom(roomName));
        dispatch(roomActions.getChat(roomName));
      };

      const resetRoom = () => {
        dispatch(roomActions.resetRoom());
      };

      socket.on('joined-room', getRoom);
      socket.on('resume-room', resumePlaying);
      socket.on('pause-room', pausePlaying);
      socket.on('changed-video', changedVideoEvent);
      socket.on('seek-video', seekVideo);
      socket.on('request-room-player-data', shareRoomState);
      socket.on('share-room-player-data', processRoomState);
      socket.on('receive-message', receiveMessage);
      socket.on('leave-room', resetRoom);

      return () => {
        socket.off('joined-room', getRoom);
        socket.off('resume-room', resumePlaying);
        socket.off('pause-room', pausePlaying);
        socket.off('changed-video', changedVideoEvent);
        socket.off('seek-video', seekVideo);
        socket.off('request-room-player-data', shareRoomState);
        socket.off('share-room-player-data', processRoomState);
        socket.off('receive-message', receiveMessage);
        socket.off('leave-room', resetRoom);
      };
    }
  }, [
    changedVideoEvent,
    dispatch,
    roomName,
    isConnected,
    pausePlaying,
    resumePlaying,
    socket,
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
          flexDirection: { xs: 'column', lg: 'row' },
          height: { xs: '120vh', lg: '95vh' },
          maxHeight: '95vh',
        }}
      >
        <Box
          p={2}
          width={{ xs: '100%', lg: '75%' }}
          height={{ xs: '50%', lg: '100%' }}
          position="relative"
        >
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
          alignItems="center"
          flexDirection="column"
          maxHeight={{ lg: '85vh' }}
          width={{ xs: '100%', lg: '25%' }}
        >
          <Box
            sx={{
              height: { lg: '20%' },
              width: '100%',
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
          <Box
            sx={{
              height: { xs: '60vh', lg: '80%' },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
              }}
            >
              <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                <Tab label="Chat" value="chat" />
                <Tab label="Playlist" value="playlist" />
              </Tabs>
            </Box>
            <Paper
              sx={{
                width: '100%',
                p: 2,
                height: '100%',
                overflowY: 'scroll',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}
            >
              {tab === 'playlist' &&
                room.currentPlaylistItems &&
                room.currentPlaylistItems.items.map(e => (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mx={{ lg: 2 }}
                    key={e.id}
                  >
                    <Typography>{e.snippet.title}</Typography>
                    <Button
                      onClick={() => changeVideo(e.contentDetails.videoId)}
                      sx={{ wordWrap: 'normal' }}
                    >
                      Change Video
                    </Button>
                  </Box>
                ))}

              {tab === 'chat' && (
                <>
                  <Box mb={3} sx={{ overflowY: 'scroll', maxHeight: '90%' }}>
                    {messages.map(msg => (
                      <ChatMessage chatItem={msg} key={JSON.stringify(msg)} />
                    ))}
                  </Box>
                  <TextField
                    sx={{ justifySelf: 'flex-end', width: '100%' }}
                    placeholder="Send a message"
                    variant="standard"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          color="primary"
                          onClick={handleSubmit(formdata => {
                            socket.emit('send-message', roomName, {
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
                </>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

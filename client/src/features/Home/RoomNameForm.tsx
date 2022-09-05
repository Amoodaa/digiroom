import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from 'app/hooks';
import { roomActions } from 'slices/room/slice';
import urlParser from 'js-video-url-parser';
import type { YouTubeParseResult } from 'js-video-url-parser';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type Props = {
  open: boolean;
  handleClose: () => void;
  youtubeUrl: string;
};

export const roomNameSchema = yup.object({
  roomName: yup.string().test(function (val) {
    if (val && !val.split(' ').length)
      return this.createError({ message: 'Spaces are not allowed' });
    return true;
  }),
});

export const RoomNameForm: React.FC<Props> = ({ open, handleClose, youtubeUrl }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const roomNameForm = useForm({
    defaultValues: { roomName: '', username: localStorage.getItem('username') ?? '' },
    shouldFocusError: true,
    resolver: yupResolver(roomNameSchema),
  });

  const roomFormOnSubmit = roomNameForm.handleSubmit(async ({ roomName, username }) => {
    const parsed = urlParser.parse(youtubeUrl) as YouTubeParseResult;
    if (parsed) {
      const result = await dispatch(
        roomActions.createRoom({
          name: roomName,
          playlistId: parsed.list,
          videoId: parsed.id,
          username,
        }),
      );
      localStorage.setItem('username', username);
      if (result.meta.requestStatus === 'fulfilled') navigate(`/${roomName}`);
      // TODO: copy room link into clipboard+
    }
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Enter a unique room name!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Give your room a unique name!
        </DialogContentText>
        <Controller
          control={roomNameForm.control}
          name="roomName"
          render={({ field, fieldState: { error } }) => (
            <TextField
              label="Your room name"
              error={!!error}
              helperText={error?.message}
              fullWidth
              {...field}
              sx={{ width: '50%', mr: 3 }}
              autoFocus
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={roomFormOnSubmit}>Create room</Button>
      </DialogActions>
    </Dialog>
  );
};

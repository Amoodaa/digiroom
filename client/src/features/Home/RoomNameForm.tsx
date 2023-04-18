import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from 'components/MaterialUI';
import { useAppDispatch } from 'app/hooks';
import { roomActions } from 'slices/room/slice';
import urlParser from 'js-video-url-parser';
import type { YouTubeParseResult } from 'js-video-url-parser';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { roomNameSchema } from 'utils/validation.util';

type Props = {
  open: boolean;
  handleClose: () => void;
  youtubeUrl: string;
};

export const RoomNameForm: React.FC<Props> = ({ open, handleClose, youtubeUrl }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const roomNameForm = useForm({
    defaultValues: { roomName: '' },
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
    resolver: yupResolver(roomNameSchema),
  });

  const roomFormOnSubmit = roomNameForm.handleSubmit(async ({ roomName }) => {
    const parsed = urlParser.parse(youtubeUrl) as YouTubeParseResult;
    if (parsed) {
      const result = await dispatch(
        roomActions.createRoom({
          name: roomName,
          playlistId: parsed.list,
          videoId: parsed.id,
        }),
      );
      if (result.meta.requestStatus === 'fulfilled')
        setTimeout(() => {
          navigate(`/${roomName}`);
        }, 200);
      // TODO: copy room link into clipboard+
    }
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ sx: { width: '40%' } }}
    >
      <DialogTitle id="alert-dialog-title">Enter a unique room name!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
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

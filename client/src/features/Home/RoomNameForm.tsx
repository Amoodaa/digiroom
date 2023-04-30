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
  roomName: yup
    .string()
    .test(function (val) {
      if (val && !val.split(' ').length)
        return this.createError({ message: 'Spaces are not allowed' });
      return true;
    })
    .min(4, ({ min }) => `Room name must be at least ${min} characters`)
    .max(16, ({ max }) => `Room name should not exceed ${max} characters`),
});

export const RoomNameForm: React.FC<Props> = ({ open, handleClose, youtubeUrl }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const roomNameForm = useForm({
    defaultValues: { roomName: '' },
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
    resolver: yupResolver(roomNameSchema),
  });

  const generateRandomRoomName = async () => {
    const roomName = Math.random().toString(36).substring(2, 8);
    const validatedName = await roomNameSchema.validate({ roomName });
    if (validatedName.roomName) roomNameForm.setValue('roomName', validatedName.roomName);
    else generateRandomRoomName();
  };

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
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <TextField
                  label="Your room name"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  value={value}
                  onChange={onChange}
                  autoFocus
                />
                <Button
                  onClick={generateRandomRoomName}
                  sx={{ mt: 2 }}
                  variant="contained"
                >
                  Random Name
                </Button>
              </>
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={roomFormOnSubmit}>Create room</Button>
      </DialogActions>
    </Dialog>
  );
};

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { roomActions } from 'slices/room/slice';
import { usernameSchema } from 'utils/validation.util';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from 'components/MaterialUI';

export const UsernameDialoug: React.FC = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector(state => state.room.username);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!username) setOpen(true);
  }, [username]);

  const usernameForm = useForm({
    defaultValues: { username },
    shouldFocusError: true,
    resolver: yupResolver(usernameSchema),
  });

  const usernameFormOnSubmit = usernameForm.handleSubmit(({ username }) => {
    localStorage.setItem('username', username);
    dispatch(roomActions.setUsername(username));
    setOpen(false);
  });

  const handleClose = async () => {
    await usernameForm.trigger('username', { shouldFocus: true });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ sx: { width: '40%' } }}
    >
      <DialogTitle id="alert-dialog-title">Give yourself a username!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
          You only have to add this once
        </DialogContentText>
        <Controller
          control={usernameForm.control}
          name="username"
          render={({ field, fieldState: { error } }) => (
            <TextField
              label="Your username"
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
        <Button onClick={usernameFormOnSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

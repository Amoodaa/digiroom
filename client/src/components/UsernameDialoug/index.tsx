import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { roomActions } from 'slices/room/slice';

export const usernameSchema = yup.object({
  username: yup.string().max(30).min(1).required(),
});

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

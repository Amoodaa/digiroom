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

type FormValues = {
  username: string;
};

export const UsernameDialoug: React.FC = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector(state => state.room.username);
  const [open, setOpen] = useState(!username);

  useEffect(() => {
    setOpen(!username);
  }, [username]);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { username },
    shouldFocusError: true,
    resolver: yupResolver(usernameSchema),
  });

  const onSubmit = (data: FormValues) => {
    localStorage.setItem('username', data.username);
    dispatch(roomActions.setUsername(data.username));
    setOpen(false);
  };

  const handleClose = async () => {
    await handleSubmit(onSubmit)();
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
          control={control}
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
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

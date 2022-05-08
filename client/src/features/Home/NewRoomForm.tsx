import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { youtubeUrlRegex } from 'utils/regex.util';
import { useState } from 'react';
import { RoomNameForm } from './RoomNameForm';

export const youtubeUrlSchema = yup.object({
  youtubeUrl: yup.string().matches(youtubeUrlRegex, 'Please provide a valid youtube url!').required('Please provide a youtube url to start a room!'),
});

export function NewRoomForm() {
  const youtubeUrlForm = useForm({
    defaultValues: { youtubeUrl: '' },
    shouldFocusError: true,
    resolver: yupResolver(youtubeUrlSchema),
  });

  const [open, setOpen] = useState<boolean>(false);

  const youtubeFormOnSubmit = youtubeUrlForm.handleSubmit(formData => {
    setOpen(true);
  });

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box component="form" display="flex" justifyContent="center">
        <Controller
          control={youtubeUrlForm.control}
          name="youtubeUrl"
          render={({ field, fieldState: { error } }) => (
            <TextField label="Youtube Url" error={!!error} helperText={error?.message} fullWidth {...field} sx={{ width: '50%', mr: 3 }} />
          )}
        />
        <Button size="large" color="primary" variant="contained" onClick={youtubeFormOnSubmit}>
          Start a room
        </Button>
      </Box>
      {<RoomNameForm open={open} handleClose={handleClose} youtubeUrl={youtubeUrlForm.getValues('youtubeUrl')} />}
    </>
  );
}

import { Box, Button, TextField } from 'components/MaterialUI';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { youtubeUrlSchema } from 'utils/validation.util';
import { FC } from 'react';

type YoutubeUrlForm = {
  youtubeUrl: string;
};

export const NewRoomForm: FC<{ onSubmit: (formData: YoutubeUrlForm) => void }> = ({
  onSubmit,
}) => {
  const youtubeUrlForm = useForm<YoutubeUrlForm>({
    defaultValues: { youtubeUrl: '' },
    shouldFocusError: true,
    resolver: yupResolver(youtubeUrlSchema),
  });

  const youtubeFormOnSubmit = youtubeUrlForm.handleSubmit(formData => {
    onSubmit(formData);
  });

  return (
    <>
      <Box component="form" display="flex" justifyContent="center">
        <Controller
          control={youtubeUrlForm.control}
          name="youtubeUrl"
          render={({ field, fieldState: { error } }) => (
            <TextField
              label="Youtube Url"
              error={!!error}
              helperText={error?.message}
              fullWidth
              {...field}
              sx={{ width: '50%', mr: 3 }}
            />
          )}
        />
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={youtubeFormOnSubmit}
        >
          Start a room
        </Button>
      </Box>
    </>
  );
};

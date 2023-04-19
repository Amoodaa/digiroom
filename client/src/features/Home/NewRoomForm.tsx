import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField } from 'components/MaterialUI';
import { youtubeUrlSchema } from 'utils/validation.util';

type YoutubeUrlForm = {
  youtubeUrl: string;
};

interface Props {
  onSubmit: (formData: YoutubeUrlForm) => void;
}

export const NewRoomForm: FC<Props> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm<YoutubeUrlForm>({
    defaultValues: { youtubeUrl: '' },
    shouldFocusError: true,
    resolver: yupResolver(youtubeUrlSchema),
  });

  const youtubeFormOnSubmit = handleSubmit(formData => {
    onSubmit(formData);
  });

  return (
    <>
      <Box component="form" display="flex" justifyContent="center">
        <Controller
          control={control}
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

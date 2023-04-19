import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from 'app/hooks';
import { searchActions } from 'slices/search/slice';
import { YoutubeSearchForm } from 'slices/search/types';
import { youtubeSearchSchema } from 'utils/validation.util';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
} from 'components/MaterialUI';

export function Searchbar() {
  const dispatch = useAppDispatch();
  const form = useForm<YoutubeSearchForm>({
    defaultValues: { searchTerm: '', type: 'playlists' },
    shouldFocusError: true,
    resolver: yupResolver(youtubeSearchSchema),
  });

  const onSubmit = form.handleSubmit(formData =>
    dispatch(searchActions.searchYoutube(formData)),
  );

  return (
    <Box component="form" display="flex" justifyContent="center" onSubmit={onSubmit}>
      <ToggleButtonGroup
        color="primary"
        value={form.watch('type')}
        exclusive
        onChange={(_, value) => value && form.setValue('type', value)}
        sx={{ mr: 1 }}
      >
        <ToggleButton value="playlists">Playlist</ToggleButton>
        <ToggleButton value="videos">Video</ToggleButton>
      </ToggleButtonGroup>
      <Controller
        control={form.control}
        name="searchTerm"
        render={({ field, fieldState: { error } }) => (
          <TextField
            label="Course Subject"
            error={!!error}
            helperText={error?.message}
            fullWidth
            {...field}
            sx={{ width: '40%', mr: 1 }}
          />
        )}
      />
      <Button size="large" color="primary" variant="contained" type="submit">
        Search
      </Button>
    </Box>
  );
}

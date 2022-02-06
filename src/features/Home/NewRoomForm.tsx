import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const youtubeUrlSchema = yup.object({
  youtubeUrl: yup
    .string()
    .required("Please provide a youtube url to start a room!"),
});

export function NewRoomForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { youtubeUrl: "" },
    shouldFocusError: true,
    resolver: yupResolver(youtubeUrlSchema),
  });

  const onSubmit = handleSubmit((formData) => {});

  return (
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
            sx={{ width: "50%", mr: 3 }}
          />
        )}
      />
      <Button
        size="large"
        color="primary"
        variant="contained"
        onClick={onSubmit}
      >
        Start a room
      </Button>
    </Box>
  );
}

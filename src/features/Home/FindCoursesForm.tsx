import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const youtubeQuerySchema = yup.object({
  searchFor: yup.string().required(),
});

export function FindCourses() {
  const { control, handleSubmit } = useForm({
    defaultValues: { searchFor: "" },
    shouldFocusError: true,
    resolver: yupResolver(youtubeQuerySchema),
  });

  const onSubmit = handleSubmit((formData) => formData);

  return (
    <Box component="form" display="flex" justifyContent="center">
      <Controller
        control={control}
        name="searchFor"
        render={({ field, fieldState: { error } }) => (
          <TextField
            label="Course Subject"
            error={!!error}
            helperText={error?.message}
            fullWidth
            {...field}
            sx={{ width: "40%", mr: 1 }}
          />
        )}
      />
      <Button
        size="large"
        color="primary"
        variant="contained"
        onClick={onSubmit}
      >
        Search
      </Button>
    </Box>
  );
}

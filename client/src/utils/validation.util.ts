import * as yup from 'yup';
import { youtubeUrlRegex } from './regex.util';

export const usernameSchema = yup.object({
  username: yup.string().max(20).min(4).required(),
});

export const youtubeUrlSchema = yup.object({
  youtubeUrl: yup
    .string()
    .matches(youtubeUrlRegex, 'Please provide a valid youtube url!')
    .required('Please provide a youtube url to start a room!'),
});

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

export const youtubeSearchSchema = yup.object({
  searchTerm: yup.string().required(),
  type: yup.string().required(),
});

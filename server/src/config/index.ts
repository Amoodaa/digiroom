import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_URL, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, YOUTUBE_API_KEY } = process.env;

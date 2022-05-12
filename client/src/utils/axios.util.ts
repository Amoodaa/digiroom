import { baseConfig } from 'baseConfig';
import Axios from 'axios';

export const axios = Axios.create({
  baseURL: baseConfig.API_URL,
});

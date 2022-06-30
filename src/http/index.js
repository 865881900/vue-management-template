import { Axios } from './Axios.js';

export const axios = new Axios(
  {
    timeout: process.env.API_TIMEOUT || 60000,
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  process.env.VUE_APP_API
);

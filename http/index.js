import { Axios } from './Axios.js';

export const axios = new Axios(
  {
    timeout: 60000,
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  process.env.VUE_APP_API
);

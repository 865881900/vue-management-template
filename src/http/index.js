import { Axios } from './Axios.js';
import webpackConfig from '../../webpack/webpackConfig';

export const axios = new Axios(
  {
    timeout: webpackConfig.VUE_APP_API_TIMEOUT || 30000,
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  webpackConfig.VUE_APP_API_URL
);

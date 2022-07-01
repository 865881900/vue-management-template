import { Axios } from './Axios.js';
import webpackConfig from '../../webpack/webpackConfig';

export const axios = new Axios(
  {
    timeout: webpackConfig.API_TIMEOUT || 60000,
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  webpackConfig.VUE_APP_API
);

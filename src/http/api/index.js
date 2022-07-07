import { axios } from '../index';

const user = {
  login() {
    return axios.post('user/login');
  },
  init() {
    return axios.post('user/init');
  }
};
export { user };

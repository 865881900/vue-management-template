import { axios } from '../index';

const user = {
  getUserInfo() {
    return axios.get('test/get');
  }
};
export { user };

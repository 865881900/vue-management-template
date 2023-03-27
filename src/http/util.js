import { Message } from 'element-gui';

export const defaultCallback = (response) => {
  if (process.env.NODE_ENV === 'development') {
    Message.warning(`${response.url}接口报错`);
  } else {
    console.error('接口报错');
  }
};
export const codeDefaultCallback = (data) => data;

import { Message } from 'element-gui';
import { codeDefaultCallback } from './util';

const defaultData = {
  code: 1000,
  data: {},
  message: ''
};

export const callbackMap = {
  // response.status    映射处理函数
  status: {
    401: () => {
      console.log('无权限或者登录超时');
      // 无权限操作
      return defaultData;
    },
    404: ({ config }) => {
      if (process.env.NODE_ENV === 'development') {
        Message.warning(`${config.url}请检查url拼写是否正确,404`);
      } else {
        console.error('请检查url拼写是否正确');
      }
      return defaultData;
    },
    500: ({ config }) => {
      if (process.env.NODE_ENV === 'development') {
        Message.warning(`${config.url}服务器500`);
      } else {
        console.error('服务器异常');
      }
      return defaultData;
    },
    504: () => {
      if (process.env.NODE_ENV === 'development') {
        Message.warning('服务器未启动');
      } else {
        console.error('服务器未启动');
      }
      return defaultData;
    }
  },
  // response.data.code 映射处理函数
  code: {
    500: (data) => {
      if (process.env.NODE_ENV === 'development') {
        Message.warning(`接口报错: ${data.message}`);
      } else {
        Message.warning(data.message);
      }
      return codeDefaultCallback();
    }
  }
};

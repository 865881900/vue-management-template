// import { Message } from 'element-gui';

export const callbackMap = {
  // response.status    映射处理函数
  status: {
    401: (data) => {
      console.log('无权限');
      return data;
      // 无权限操作
    },
    500: (data) => {
      console.log('500', data.toString());
      // Message({
      //   showClose: true,
      //   message: '服务器异常',
      //   type: 'error',
      //   single: true
      // });
    }
  },
  // response.data.code 映射处理函数
  code: {
    500: ({ msg }) => {
      console.log(msg);
      // Message({
      //   showClose: true,
      //   message: msg || '网络异常,请稍后重试',
      //   type: 'error',
      //   single: true
      // });
    }
  }
};

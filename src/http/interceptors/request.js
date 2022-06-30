export default [
  {
    onFulfilled: (config) => {
      console.log('请求拦截器');
      // 在发送请求之前做些什么
      return config;
    },
    onRejected: (error) => {
      console.log('请求错误拦截器');
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  }
];

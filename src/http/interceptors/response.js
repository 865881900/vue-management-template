export default [
  {
    onFulfilled: (response) => {
      console.log('响应200-299拦截器');
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      return response;
    },
    onRejected: (error) => {
      console.log('响应非200-299拦截器');
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  }
];

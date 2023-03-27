import { ShowLoadingController } from './routerEventOption.js';

export let showLoadingController;

export const BaseRouterLoading = {
  install(Vue, axios) {
    // 显示loading的控制器;
    showLoadingController = new ShowLoadingController(Vue);
    if (!axios) {
      return;
    }
    BaseRouterLoading.initAxios(axios);
  },

  initAxios(axios) {
    // 配置求取拦截, 在headers上添加tag字段,为请求的唯一标识
    axios.interceptors.request.use((config) => {
      config.tag = showLoadingController.addRouterQueue();
      return config;
    });

    // 配置响应拦截, 从headers上获取tag字段
    axios.interceptors.response.use(
      (response) => {
        showLoadingController.deleteRouterQueue(response.config.tag);
        return response;
      },
      (error) => {
        showLoadingController.deleteRouterQueue(error.response.config.tag);
        return Promise.reject(error);
      }
    );
  }
};

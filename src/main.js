import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import { BaseRouterLoading } from '@/components/app/app-router-loading/index.js';
import { axios } from './http';

Vue.use(BaseRouterLoading, axios.axios);

// 按需引入UI框架
import { Button, Select } from 'element-gui';
Vue.use(Button);
Vue.use(Select);

// 全部引入UI框架
// import Element from 'element-gui';
// Vue.use(Element);

// 引入全局的css样式
import('@/assets/css/index.css');

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

import Vue from 'vue';
import App from '@/App.vue';

// 按需引入UI框架
import { Button, Select } from 'element-gui';
Vue.use(Button);
Vue.use(Select);

// 全部引入UI框架
// import Element from 'element-gui';
// Vue.use(Element);

// 引入全局的css样式
import('@/assets/css/index.css');

import router from '@/router';
import store from '@/store';

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

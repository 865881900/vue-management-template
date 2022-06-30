import Vue from 'vue';
import App from '@/App.vue';
import('./a.js');
import ElementUI from 'element-gui';
import 'element-gui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import router from '@/router';
import store from '@/store';

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

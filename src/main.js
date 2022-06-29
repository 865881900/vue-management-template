import Vue from 'vue';
import App from './App.vue';

console.log(process.env);
new Vue({
  name: 'Main',
  render: (h) => h(App)
}).$mount('#app');

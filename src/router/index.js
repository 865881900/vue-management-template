import VueRouter from 'vue-router';
import Vue from 'vue';
import { ControlDynamicRouter } from './dynamicRouter/ControlDynamicRouter.js';
import { user } from '../http/api/index.js';

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      title: '登录',
      name: 'login',
      path: '/login',
      component: () => import('@/views/login/index'),
      meta: {
        notLogin: true
      }
    },
    {
      title: '主页面',
      name: 'Main',
      path: '/main',
      component: () => import('@/views/main/index')
    },
    {
      title: '找回密码',
      name: 'forget-password',
      path: '/forget-password',
      component: () => import('@/views/forget-password'),
      meta: {
        notLogin: true
      }
    },
    {
      path: '*',
      redirect: '/main'
    }
  ],
  // 路由切换, 滚动条重置
  scrollBehavior() {
    return {
      top: 0
    };
  }
});

new ControlDynamicRouter({
  idName: 'resCode',
  getUserMenuPromiseFun: async () => {
    const {
      data: { menuList }
    } = await user.init();
    return menuList;
  },
  addRouteOption: {
    path: '/',
    title: 'main',
    name: 'Main',
    component: () => import('@/views/main')
  },
  router: router
});

// 处理路由异常
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
export default router;

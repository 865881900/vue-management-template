# 动态路由模块

> 是根据角色权限信息动态匹配路由和生成导航栏数据;
> 在初始化该模块时,会把该对象绑定到vue实例的vm.$dynamicRouter上

使用该模块要在 src/router/dynamicRouter 目录下添加配置文件: routes.js

# ControlDynamicRouter 构建选项

dynamicOptions

* 类型: dynamicOptions:DynamicOptions

```ts
interface DynamicOptions  {
  getUserMenuPromiseFun(): () => Array<UserMenu>;
  addRouteOption: RouteConfig;
  router: Router;
  idName?: string;
}
```


getUserMenuPromiseFun
* 类型: Function () => Array<UserMenu>;
* 是否必填: true

  UserMenu: 签名
```ts
interface UserMenu {
  [idName]: string; // 模块的唯一标识
  title?: string;
  children?: Array<RouteConfig>; // 子模块
  icon?: string;
  path?: string;
  [string]?: any;
}
```
    获取用户角色权限信息的api封装,返回该用户的权限列表函数

addRouteOption
* 类型: RouteConfig
* 是否必填: true

  签名:
```ts
interface RouteConfig {
  path?: string;
  component?: Component;
  name?: string; // 命名路由
  components?: { [name: string]: Component }; // 命名视图组件
  redirect?: string | Location | Function;
  props?: boolean | Object | Function;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>; // 嵌套路由
  beforeEnter?: (to: Route, from: Route, next: Function) => void;
  meta?: any;

  // 2.6.0+
  caseSensitive?: boolean; // 匹配规则是否大小写敏感？(默认值：false)
  pathToRegexpOptions?: Object; // 编译正则的选项
}
```
  模块需要依赖的父组件,该组件必须有<router-view>标签

router
* 类型: Router
* 是否必填: true

  全局Router对象


idName
* 类型: string
* 默认值: 'idName'

  如果本地routes中配置和api返回权限中用模块的唯一ID; 用来匹配权限对应的模块

# ControlDynamicRouter 实例属性

dynamicOptions.defaultPath
* 类型: string
  遍历生成的导航数据,返回第一个还有path的对象的path值, 一般用来登录后默认跳转的首页

dynamicOptions.menuList
* 类型: Array\<LocaMenu\>

  LocaMenu: 签名
```ts
interface LocaMenu  {
  reCode: string; // 模块的唯一标识
  title: string;
  path: string;
  children?: Array<RouteConfig>; // 子模块
  icon?: string;
  [string]?: any;
}
```
> 返回导航嵌套信息,一般用来渲染导航栏;
> 注意: LocaMenu 会合并配置和接口匹配的值, 如果两者有相同的属性, 那么本地配置的优先级别高;



# ControlDynamicRouter 实例方法
dynamicOptions.reloadDynamicRouter

函数签名:
```ts
dynamicOptions.reloadDynamicRouter(dynamicOptions)
```
  但用户切换角色时,重新执行动态添加路由和生成导航栏信息


# routes.js 配置
该配置分为三种形式, 根据实际情况进行组合

###第一种: 目录菜单
> 点击后展开子菜单,没有对应页面;

配置示例:
```ts
export default [
  {
    name: '企业查询',
    resCode: 'GG-QYCX'
  }
]
```

###第二种: 普通模块
>点击对应导航后,跳转到指定页面, 所有和该模块有关系的业务都在该模块中完成,没有子模块; 该模块对应的组件内不包含<router-view> 或者 <component/>组件;

配置示例:
```js
export default [
  {
    name: 'a',
    title: 'A模块',
    resCode: 'GZ_GFM_ENTERPRISE_LIST',
    path: '/a',
    component: () => import('@/views/a'),
  }
]
```
###第三种: 嵌套模块
> 点击对应导航后,跳转到指定页面,模块内包含子模块; 模块对应的组件中包含<router-view/> 或者 <component/>组件;

配置示例:
```js
export default [
  {
    name: 'a',
    title: 'A模块',
    resCode: 'GZ_GFM_ENTERPRISE_LIST',
    path: '/a',
    component: () => import('@/views/a'),
    children: [{   //他的children中的页面不能在左侧导航切换,  children 表示A模块中依赖的页面, 跳转到该页面后, 左侧导航不会发生变化
      name: 'a1',
      title: 'A1页面',
      path: '/a1',
      component: () => import('@/views/a/a1'),
    }]
  }
]
```


# 使用
* 1.配置routes.js
```javascript
export default  [
  {
    resCode: 'user_info',
    title: '用户信息'
  },
  {
    name: 'userAge',
    title: '年龄信息',
    resCode: 'user_age',
    path: '/userAge',
    component: () => import('@/views/UserAge')
  },
  {
    name: 'userHome',
    title: '家庭信息',
    resCode: 'user_home',
    path: '/userHome',
    component: () => import('@/views/UserHome')
  }
];
```


* 2.接口数据
```javascript
// user/info 返回数据
return [
  {
    "reCode": "user_info",
    "name": "user_info",
    "children": [
      {
        "name": "userAge",
        "reCode": "user_age",
        "title": "我的见证",
      },
      {
        "reCode": "user_home",
      }
    ]
  }
]
```


* 4.构建ControlDynamicRouter对象
```javascript
import VueRouter from 'vue-router';
import Vue from 'vue';
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
      component: () => import('@/views/main/index')
    }
  ]
});

new ControlDynamicRouter({
  idName: 'resCode', // 匹配依据
  getUserMenuPromiseFun: async () => {
    try {
      // data为一个数组,表示该用户的权限数据
      const { data } = await axios({
        method: 'POST',
        url: 'user/info'
      });
      return data;
    } catch (e) {
      console.log('获取路由信息失败');
      return [];
    }
  },
  addRouteOption: {  // 这些组件的上一级组件
    title: 'main',
    name: 'Main',
    path: '/main',
    component: () => import('@/views/main')
  },
  router: router
});
export default router;
```

* 5:使用 main.vue

```vue
<template>
  <div>
    <main-head/>
    <div>
      <BaseMenu :menuList="$dynamicRouter.menuList"/>
      <router-view/>
    </div>
    <main-footer/>
  </div>
</template>
<script>
export default {
  name: 'Main',
  created() {},
  watch: {
    '$dynamicRouter上.menuList'() {
      console.log('监听导航变化');
    }
  },
  methods: {}
};
</script>

<style></style>
```


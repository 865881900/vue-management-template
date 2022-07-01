# Axios

> Axios类是对axios的二次封装,包含一下功能;在index.js暴露Axios的实例;

1: 通过配置,来处理不同code
2: 封装好get/post逻辑和错误处理
3: 提供多种api

# 使用

1: 基础
```javascript
import { axios } from './apis/index.js';

axios.get('http://localhost:3000/test/get').then(data => {
  console.log(data);
})
```

2: 支持async/await用法
```javascript
import { axios } from './apis/index.js';

async function fun() {
  try {
    const data = axios.get('http://localhost:3000/test/get');
    console.log(data);
  } catch (e) {
    console.error(e.message);
  }
}
```
3: 目前支持两种编码格式
```javascript
import { axios } from './apis/index.js';
axios.post(); // content-type: application/x-www-form-urlencoded
axios.postJ();// content-type: application/json;charset=UTF-8
```

# API

### axios.request(url,datas, method, webpackConfig);
options:
```
url<String>: 请求路径
datas<Object>: 请求参数
method<String>: 请求方式: 'GET', 'DELETE', 'HEAD', 'POST', 'PUT', 'PATCH', 支持小写; 默认值:'GET'
webpackConfig<Object>: 本次请求配置
```

options:

### axios.get(url, data, webpackConfig);
###axios.head(url,datas, webpackConfig);
###axios.delete(url,datas, webpackConfig);
###axios.post(url,datas, webpackConfig);
###axios.put(url,datas, webpackConfig);
###axios.patch(url,datas, webpackConfig);
options:
```
url<String>: 请求路径
datas<Object>: 请求参数
webpackConfig<Object>: 本次请求配置
```
>  content-type: application/x-www-form-urlencoded

###axios.postJ(url,datas, webpackConfig);
###axios.putJ(url,datas, webpackConfig);
###axios.patchJ(url,datas, webpackConfig);
```
options:
url<String>: 请求路径
datas<Object>: 请求参数
webpackConfig<Object>: 本次请求配置
```
> content-type: application/json;charset=UTF-8



#callbackMap配置
>为了减少开发过程中,每次去处理相同含义的code, 通过配置方式,给处理方式相同的code指定处理函数;
```javascript
// callbackMap
export const callbackMap = {
  code: {
    500: () => {
      // 如果是401,则跳转到login页面
      message.error('请稍后重试')
    }
  },
  status: {
    401: () => {
      // 如果是401,则跳转到login页面
      router.push('/login')
    }
  }
}
```
为了增大灵活度我们提供了response.data.code和response.status返回码对应的处理函数; 使用这个功能的前期是要和后端同学约定好每一个值包含的意义;


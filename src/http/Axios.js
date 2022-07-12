/**
 * @file: 对axios的封装
 * 不用写各种code对应的处理方式,使用配置化,对code码进行处理;
 * 封装常用的get,post方法, 可以直接使用
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/4/24 5:22 PM
 */
import axios from 'axios';
import _ from 'loadsh';
import { callbackMap } from './callbackMap.js';
import requestInterceptors from './interceptors/request.js';
import responseInterceptors from './interceptors/response.js';
import { ControlCache } from 'gld-api-cache-ts';
// const http = new ControlCache(/^\/aa\//);
console.log(ControlCache);
const responseCallback = (data) => data;

export class Axios {
  // 需要把data拼接到url的方式;
  static JOINT_METHOD = ['GET', 'DELETE', 'HEAD'];

  // 被支持的方式;
  static METHODS_LIST = ['GET', 'DELETE', 'HEAD', 'POST', 'PUT', 'PATCH'];

  /**
   * 初始化Ajax对象
   * @param defaultConfig:<Function(axios)>: 初始化axios的默认配置
   * @param vueAppApi:<Function(axios)>: 默认api路径
   */
  constructor(defaultConfig, vueAppApi = '') {
    // 初始化拦截器
    this._initInterceptors();
    this.axios = axios.create(defaultConfig);
    this.vueAppApi = vueAppApi;
  }

  async request(url, datas = {}, method = 'GET', config = {}) {
    // 请求方法转为大写
    const _method = method.toUpperCase();
    let fun; // 回调函数
    try {
      // 检查方法有效性
      if (!Axios.METHODS_LIST.includes(_method)) {
        console.error('请求方式不被支持');
        return;
      }
      // 合并config
      const configs = {
        ...config,
        url: `${this.vueAppApi}${url}${this._jointAjaxData(datas, method)}timestamp=${new Date().getTime()}`,
        method: _method
      };
      // 如果不是类似get请求, 把参数添加到body中
      if (!Axios.JOINT_METHOD.includes(_method)) {
        config.data = datas;
      }
      const { data: responseData } = await axios.request(configs);
      // 根据statue和code 返回回调函数,如果没有配置,则使用默认回调函数;
      fun = callbackMap.code[responseData.code] || callbackMap.status[responseData.status] || responseCallback;
      // 执行回调函数
      if (_.isFunction(fun)) {
        return fun(responseData);
      }
    } catch (e) {
      const response = e.response || {};
      fun = callbackMap.status[response.status];
      if (_.isFunction(fun)) {
        return fun(e);
      }
      return Promise.reject(e);
    }
  }

  // 初始化拦截器
  _initInterceptors() {
    requestInterceptors.forEach(({ onFulfilled, onRejected, options }) => {
      this.addInterceptorsRequest(onFulfilled, onRejected, options);
    });
    responseInterceptors.forEach(({ onFulfilled, onRejected, options }) => {
      this.addInterceptorsResponse(onFulfilled, onRejected, options);
    });
  }

  // 拼接url
  _jointAjaxData(data, method) {
    let url = '?';
    if (Axios.JOINT_METHOD.includes(method)) {
      const keys = Object.keys(data);
      keys.forEach((item) => {
        let itemStr = item;
        if (_.isObject(item) || _.isArray(item)) {
          itemStr = JSON.stringify(item);
        } else if (_.isSymbol(item)) {
          throw new TypeError('Symbol cannot be converted to JSON');
        } else if (_.isFunction(item)) {
          throw new TypeError('Function cannot be converted to JSON');
        }
        url += `${item}=${itemStr}&`;
      });
    }
    return url;
  }

  // GET method
  get(url, data, config) {
    return this.request(url, data, 'GET', config);
  }

  // head method
  head(url, data, config) {
    return this.request(url, data, 'HEAD', config);
  }

  // DELETE method
  delete(url, data, config) {
    return this.request(url, data, 'DELETE', config);
  }

  // POST method
  post(url, data, config) {
    return this.request(url, data, 'POST', config);
  }

  // POST method json
  postJ(url, data, config = {}) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['content-type'] = 'application/json;charset=UTF-8';
    return this.request(url, data, 'POST', config);
  }

  // PUT method
  put(url, data, config) {
    return this.request(url, data, 'PUT', config);
  }

  // PATCH method
  patch(url, data, config) {
    return this.request(url, data, 'PATCH', config);
  }

  addInterceptorsRequest(onFulfilled, onRejected, options) {
    axios.interceptors.request.use(onFulfilled, onRejected, options);
  }

  addInterceptorsResponse(onFulfilled, onRejected, options) {
    axios.interceptors.response.use(onFulfilled, onRejected, options);
  }
}

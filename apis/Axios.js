/**
 * @file: 对axios的封装
 * 不用写各种code对应的处理方式,使用配置化,对code码进行处理;
 * 封装常用的get,post方法, 可以直接使用
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/4/24 5:22 PM
 */
import axios from 'axios';
import _ from 'loadsh';
import { callbackMapByState } from './callbackMapByState.js';

const responseCallback = (data) => data;

export class Axios {
  // 需要把data拼接到url的方式;
  static JOINT_METHOD = ['GET', 'DELETE', 'HEAD'];

  // 被支持的方式;
  static METHODS_LIST = ['GET', 'DELETE', 'HEAD', 'POST', 'PUT', 'PATCH'];

  /**
   * 初始化Ajax对象
   * @param defaultConfig:<Function(axios)>: 初始化axios的默认配置
   */
  constructor(defaultConfig) {
    this.axios = axios.create(defaultConfig);
  }

  async request(urls, datas = {}, method = 'GET', config = {}) {
    const url = urls;
    // 请求方法转为大写
    const _method = method.toUpperCase();
    let status; // 响应状态
    let fun; // 回调函数
    let _response; // 响应对象
    try {
      // 检查方法有效性
      if (!Axios.METHODS_LIST.includes(_method)) {
        console.error('请求方式不被支持');
        return;
      }
      // 合并config
      const configs = {
        ...config,
        url: `${url}${this._jointAjaxData(datas, method)}timestamp=${new Date().getTime()}`,
        method: _method
      };
      // 如果不是类似get请求, 把参数添加到body中
      if (!Axios.JOINT_METHOD.includes(_method)) {
        config.data = datas;
      }
      _response = await axios.request(configs);
      const { data: responseData } = _response;
      status = _response.status;
      // 根据statue和code 返回回调函数,如果没有配置,则使用默认回调函数;
      fun = callbackMapByState.code[responseData.code] || callbackMapByState.status[status] || responseCallback;
      // 执行回调函数
      if (_.isFunction(fun)) {
        return fun(responseData);
      }
    } catch (e) {
      fun = callbackMapByState[status];
      if (_.isFunction(fun)) {
        return fun(e);
      }
      throw new Error(e);
    }
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

  // PUT method
  patch(url, data, config) {
    return this.request(url, data, 'PATCH', config);
  }
}

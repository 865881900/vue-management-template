/**
 * @file: 浏览器storage缓存操作对象
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/5/11 6:20 PM
 */

import { CacheWriteError } from '../error/CacheWriteError';

export class SessionStorageCache {
  cacheSize = 0;

  MAX_SIZE = 3 * 1024 * 1024;

  constructor() {
    // 计算当前缓存中的字数大小
    Object.keys(sessionStorage).forEach((item) => {
      const valueLength = sessionStorage.getItem(item).length;
      this.cacheSize += valueLength;
    });
  }

  // 返回storage中,该程序写入的缓存的key
  getSessionStorageKeys() {
    return Object.keys(sessionStorage)
      .filter((item) => item.startsWith('HTTP_TAG_'))
      .map((item) => item.slice(9));
  }

  // 返回缓存对象
  getData(key) {
    const getDataStr = sessionStorage.getItem(`HTTP_TAG_${key}`) || '{"value":null,"querys":{}}';
    return JSON.parse(getDataStr);
  }

  // 增/改缓存
  setData(key, value) {
    const steDataStr = JSON.stringify(value);
    try {
      const getDataStr = sessionStorage.getItem(`HTTP_TAG_${key}`) || '';
      this.cacheSize += steDataStr.length - getDataStr.length;
      sessionStorage.setItem(`HTTP_TAG_${key}`, steDataStr);
    } catch (e) {
      throw new CacheWriteError('sessionStorage save error');
    }
  }

  // 删除缓存
  clear() {
    Object.keys(sessionStorage)
      .filter((item) => item.startsWith('HTTP_TAG_'))
      .forEach((item) => {
        sessionStorage.removeItem(`${item}`);
      });
    this.cacheSize = 0;
  }

  romeItem(key) {
    const getDataStr = sessionStorage.getItem(`HTTP_TAG_${key}`) || '';
    this.cacheSize -= getDataStr.length;
    sessionStorage.removeItem(key);
  }

  has(key) {
    return sessionStorage.getItem(`HTTP_TAG_${key}`) !== null;
  }
}

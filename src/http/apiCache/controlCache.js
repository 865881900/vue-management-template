/**
 * @file: 前端缓存控制器
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/5/11 6:20 PM
 */

import { SessionStorageCache } from './entity/SessionStorageCache';
import { RuntimeMemoryCache } from './entity/RuntimeMemoryCache';
import { CACHE_API_RUL_LIST, URL_MATCH_RULE } from './cacheConfig';
import { CacheError } from './error/CacheError';
import { CacheWriteError } from './error/CacheWriteError';

const CACHE_TYPE_ENUM = {
  RMC: 'RMC',
  SSC: 'SSC'
};

// 返回o的类型
function getType(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

function isString(o) {
  return getType(o) === 'String';
}
/**
 * 前端http缓存控制器
 */
export class HTTPDataControlCache {
  // 缓存映射对象
  _cacheMap = new Map();

  // 内存缓存对象
  _RMCache = new RuntimeMemoryCache();

  // Storage缓存对象
  _SSCache = new SessionStorageCache();

  constructor() {
    // 读取当前storage中的缓存,记录到cacheMap中
    const storageKeys = this._SSCache.getSessionStorageKeys();
    if (storageKeys.length > 0) {
      storageKeys.forEach((item) => {
        this._cacheMap.set(item, {
          cacheType: CACHE_TYPE_ENUM.SSC
        });
      });
    }
  }

  /**
   * 1: 根据key,获取数据缓存的位置;
   * 2: 从缓存中取出缓存数据
   * 3: 返回该数据
   * @param key 缓存的标识
   * @return {null|*} 返回内容: 可能为null
   */
  get(key) {
    try {
      if (!this.has(key)) {
        return null;
      }
      const { gKey, gQuery } = this._genParameter(key);
      const { cacheType } = this._cacheMap.get(gKey);
      const cache = this[cacheType === CACHE_TYPE_ENUM.SSC ? '_SSCache' : '_RMCache'];
      const keyData = cache.getData(gKey);
      if (keyData.value === null && Object.keys(keyData.querys).length === 0) {
        this._cacheMap.delete(gKey);
      }

      if (gQuery === void 0) {
        return keyData.value || null;
      }
      return keyData.querys[gQuery] || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * 1: 根据key判断是否需要缓存,
   * 2: 如果需要,根据规则,选择缓存路径(内存/storage);
   * 3: 缓存数据
   * 4: 如果storage内存即将超出,则从新缓存到内存中
   * @param key: 缓存的标识
   * @param value: 需要缓存的内容
   * @return {boolean} 是否缓存成功
   */
  set(key, value) {
    let keyData, gKey, gQuery;
    try {
      // 处理key
      const parameter = this._genParameter(key);
      gKey = parameter.gKey;
      gQuery = parameter.gQuery;

      // 计算当前数据缓存位置
      const cacheType = this._getCacheLocation(gKey, value);

      // 获取该数据缓存操作对象
      const cache = this[cacheType === CACHE_TYPE_ENUM.SSC ? '_SSCache' : '_RMCache'];
      // 获取key在缓存的值, 如果没有的话返回默认对象
      keyData = cache.getData(gKey);
      if (gQuery === void 0) {
        keyData.value = value;
      } else {
        keyData.querys[gQuery] = value;
      }

      // 开始缓存
      cache.setData(gKey, keyData);

      if (!this._cacheMap.has(gKey)) {
        this._cacheMap.set(gKey, {
          cacheType
        });
      }

      return true;
    } catch (e) {
      // sessionStorage存储不下的时候;重新缓存到RAM中
      if (e instanceof CacheWriteError) {
        this._cacheMap.set(gKey, {
          cacheType: CACHE_TYPE_ENUM.RMC
        });
        this._RMCache.setData(gKey, keyData);
        this._SSCache.romeItem(gKey);
        return true;
      }

      console.error(e);
      return false;
    }
  }

  /**
   * 根据key判断是否已经有缓存路径
   * @param key
   * @return {boolean}
   */
  has(key) {
    try {
      const { gKey } = this._genParameter(key);
      if (this._cacheMap.has(gKey)) {
        const { cacheType } = this._cacheMap.get(key);
        const cache = this[cacheType === CACHE_TYPE_ENUM.SSC ? '_SSCache' : '_RMCache'];
        const boo = cache.has(gKey);
        if (boo === false) {
          this._cacheMap.delete(gKey);
        }
        return boo;
      }
      return false;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 清空所有缓存内容
   */
  emptyMemory() {
    this._RMCache.clear();
    this._SSCache.clear();
  }

  /**
   * 判断当前key是否需要进行缓存
   * @param key:
   * @return {boolean}
   */
  needCaching(key) {
    if (!isString(key)) {
      console.error('key type Must be String');
      return;
    }
    return URL_MATCH_RULE.test(key) || CACHE_API_RUL_LIST.includes(key);
  }

  /**
   * 根据当前storage缓存情况和数据的长度,来选择该数据缓存路径
   * @param key
   * @param value
   * @return {string|string|*|string|string}
   * @private
   */
  _getCacheLocation(key, value) {
    // 如果之前有过保存,返回之前保存的位置
    if (this.has(key)) {
      return this._cacheMap.get(key).cacheType;
    }
    let valueLength;
    // 转为字符串
    if (typeof value === 'object') {
      valueLength = JSON.stringify(value).length;
    } else {
      valueLength = `${value}`.length;
    }
    // 当前sessionStore所用空间大小;
    const { cacheSize, MAX_SIZE } = this._SSCache;
    // 计算字符长度,是否超过阈值;
    if (valueLength + 26 + cacheSize > MAX_SIZE || valueLength > 500 * 1025) {
      return CACHE_TYPE_ENUM.RMC;
    }
    return CACHE_TYPE_ENUM.SSC;
  }

  /**
   * 处理参数的类型和分解url
   * @param key
   * @return {{gKey, gQuery}}
   * @private
   */
  _genParameter(key) {
    let query, keys;
    if (!isString(key)) {
      console.error('key type must be String');
      throw new CacheError('key type Must be String');
    }
    [keys, query] = key.split('?');
    return {
      gQuery: query,
      gKey: keys
    };
  }
}

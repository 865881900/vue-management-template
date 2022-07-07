/**
 * @file: 浏览器内存缓存操作对象
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/5/11 6:20 PM
 */

export class RuntimeMemoryCache {
  _cacheObject = Object.create(null);

  constructor() {
    this._cacheObject = Symbol.for('_cacheObject');
  }

  // 返回缓存
  getData(key) {
    const keyData = this._cacheObject[key] || {
      value: null,
      querys: {}
    };
    return keyData;
  }

  // 增/改缓存
  setData(key, value) {
    this._cacheObject[key] = value;
  }

  // 清空缓存
  clear() {
    this._cacheObject = Object.create(null);
  }

  has(key) {
    return this._cacheObject[key] === void 0;
  }
}

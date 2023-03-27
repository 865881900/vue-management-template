import { axios } from '../index';

/** 工具接口 */
export const APIUtil = {
  getRegionCodeOptions() {
    return axios.get('common/reg-locations-tree', ...arguments);
  },

  getGfmInfoPage() {
    return axios.post('common/gfm-info-page', ...arguments);
  },

  getCommissionNum() {
    return axios.get('common/beyond-one-work-day-nums');
  },

  getBankList() {
    return axios.get('common/bank-list');
  }
};
/** 登录注册接口 */
export const APIRegister = {
  // 注册专家
  expert() {
    return axios.post('register/expert', ...arguments);
  },
  // 获取验证码
  validationCode() {
    return axios.post('register/validation-code', ...arguments);
  },
  // 专家登录
  toLogin() {
    return axios.post('commonlogin/toLogin', ...arguments);
  },

  // 专家登录
  switchIdentity() {
    return axios.get('common/switchIdentity', ...arguments);
  },
  // 返回用户信息
  getIndexData() {
    return axios.post('common/getIndexData', ...arguments);
  },

  // 返回用户信息
  getPublicKey() {
    return axios.get('commonlogin/getPublicKey', ...arguments);
  },

  // 返回用户信息
  getCARandom() {
    return axios.get('api/ca-login/random', ...arguments);
  }
};

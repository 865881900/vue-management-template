import { APIRegister } from '../../http/api';
import { Message } from 'element-gui';
import router from '../../router';
import { env as webpackConfig } from '../../../.env-cmdrc';
import encryptedData from '../../utils/encrypted';

export default {
  namespaced: true,
  name: 'user',
  state: {
    isLogin: false, // 用户当前是否登录,
    loginLoading: false, // true: 登录中; false:未登录/已经登录
    loginHint: '', // 登录错误的提示
    loginShowHint: '', // 控制登录错误提示右侧按钮
    systemCode: webpackConfig.SYSTEM_CODE, // 系统平台code
    // 允许登录的角色
    allowRoles: [
      'LE_TENDER_AGENCY', // 招标代理
      'LE_PROCUREMENT_AGENCY', // 采购代理
      'R_GEC_EXPERT', // 评审专家
      'R_GEC_ADMIN', // 交易运行处
      'R_GEC_FINANCE' // 财务处
    ],
    // 用户系统信息
    userSystemInfo: {}
  },
  getters: {
    USER_SYSTEM_INFO(state) {
      return state.userSystemInfo;
    },
    LOGIN_SHOW_HIN(state) {
      return state.loginShowHint;
    },
    LOGIN_LOADING(state) {
      return state.loginLoading;
    },
    IS_LOGIN(state) {
      return state.isLogin;
    },
    LOGIN_HINT(state) {
      return state.loginHint;
    }
  },
  mutations: {
    SET_USER_SYSTEM_INFO(state, userSystemInfo) {
      state.userSystemInfo = userSystemInfo;
    },
    SET_LOGIN_SHOW_HIN(state, loginShowHint) {
      state.loginShowHint = loginShowHint;
    },
    SET_IS_LOGIN(state, isLogin) {
      state.isLogin = isLogin;
    },
    SET_LOGIN_LOADING(state, loginLoading) {
      state.loginLoading = loginLoading;
    },
    SET_LOGIN_HINT(state, loginHint) {
      state.loginHint = loginHint;
    }
  },
  actions: {
    /**
     * @param param 登录请求参数
     * @param type 登录方式: P: 手机验证码; U: 账号密码, C: ca登录
     * @return {Promise<void>}
     */
    async LOGIN({ commit, dispatch }, param) {
      const type = param.type || '';
      delete param.type;
      commit('SET_LOGIN_LOADING', true);
      // 密码加密
      if (type === 'U') {
        const { public_key: publicKey, code, message } = await APIRegister.getPublicKey();
        if (code === 0) {
          param.password = encryptedData(publicKey, param.password);
        } else {
          commit('SET_LOGIN_LOADING', false);
          // 修改登录状态为false
          commit('SET_IS_LOGIN', false);
          // 修改错误提示
          commit('SET_LOGIN_HINT', message);
          return;
        }
      }

      const { code, msg } = await APIRegister.toLogin(param);
      if (code === 0) {
        // 请求用户配置信息
        dispatch('GET_SYSTEM_INFO', type);
      } else {
        commit('SET_LOGIN_LOADING', false);
        // 修改登录状态为false
        commit('SET_IS_LOGIN', false);
        // 修改错误提示
        commit('SET_LOGIN_HINT', msg);
        // 当code -2时候显示按钮
        if (code === -2) {
          commit('SET_LOGIN_SHOW_HIN', true);
        }
      }
    },

    // 获取用户信息
    async GET_SYSTEM_INFO({ commit, state, dispatch }, type) {
      const data = await APIRegister.getIndexData();
      const { code, sysInfo, msg, identify, identifys } = (state.userSystemInfo = data);
      if (code === 0) {
        // 修改登录成功
        commit('SET_IS_LOGIN', true);
        // 登录按钮清除登录错误提示
        commit('SET_LOGIN_HINT', '');
        // 当前系统的code
        sessionStorage.setItem('organCode', identify.organCode);
        // 当前角色的code
        localStorage.setItem('roleCode', identify.roleCode);
        // 如果是手机验证码登录, 停止切换,手动调用一下逻辑
        if (type !== 'P') {
          // 如果登录的默认系统code等于当前系统的code, 表示登录成功. 反之需要切换到有该系统权限的角色中(顺位第一);
          if (sysInfo.systemCode === state.systemCode) {
            Message.success('登录成功');
            router.push({
              name: 'index'
            });
          } else {
            // 处理角色身份问题
            dispatch('IDENTITY_HANDLED', identifys, sysInfo.webUrl);
          }
        }
      } else {
        commit('SET_IS_LOGIN', false);
        Message.warning(msg);
      }
      // 登录按钮loading结束
      commit('SET_LOGIN_LOADING', false);
    },

    // 登录后暂停后恢复登录操作
    LOGIN_BEFORE({ state, dispatch }) {
      const { sysInfo, identifys } = state.userSystemInfo;
      if (sysInfo && sysInfo.systemCode === state.systemCode) {
        Message.success('登录成功');
        router.push({
          name: 'index'
        });
      } else {
        // 处理角色身份问题
        dispatch('IDENTITY_HANDLED', identifys, sysInfo.webUrl);
      }
    },

    /**
     * 处理角色身份问题
     * @param identify 当前用户所有的角色集合
     * @param webUrl 用户加色中没有该系统权限时, 跳转的路径
     */
    IDENTITY_HANDLED({ state, dispatch }, identify, webUrl) {
      const roleIdentify = [];
      // 收集该用户角色列表中 允许访问该系统的角色信息, 后续用来切换用户角色;
      identify.forEach((r) => {
        if (state.allowRoles.indexOf(r.roleCode) != -1) {
          roleIdentify.push(r.id);
        }
      });
      // 该用户没有该系统权限的角色;
      if (roleIdentify.length == 0) {
        this.$confirm('无效的专家费角色，请联系管理员！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 跳转统一注册
          window.open(webUrl, '_blank');
        });
        return;
      }
      // 切换身份
      dispatch('SWITCH_IDENTITY', roleIdentify[0]);
    },

    // 切换用户拥有该系统权限角色中的顺位第一
    async SWITCH_IDENTITY(_, id) {
      const { code, message } = await APIRegister.switchIdentity({
        params: {
          identityId: id
        }
      });
      if (code === 0) {
        this.$router.push({
          name: 'index'
        });
      } else {
        this.$message.warning(message);
      }
    }
  }
};

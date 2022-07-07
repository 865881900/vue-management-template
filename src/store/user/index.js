export default {
  namespaced: true,
  name: 'user',
  state: {
    isLogin: false // 用户当前是否登录
  },
  getters: {
    getIsLogin(state) {
      return state.isLogin;
    }
  },
  mutations: {
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    }
  },
  actions: {}
};

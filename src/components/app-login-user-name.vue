<!-- 手机好登录组件 -->
<template>
  <div>
    <!-- 错误提示 -->
    <div class="error-hint">
      <div v-if="loginHint !== ''">
        <span class="error-hint-icon el-icon-error" @click="setLoginHint('')"></span>
        <span class="error-hint-message">{{ loginHint }}</span>
        <el-button
          class="error-hint-button"
          type="text"
          icon-right="el-icon-arrow-right"
          v-if="loginShowHint"
          @click="navRegister"
        >
          立即注册
        </el-button>
      </div>
    </div>

    <div class="login-item">
      <span class="login-item-icon">
        <img src="../assets/img/login/login-3.png" style="width: 0.18rem; height: 0.18rem" />
      </span>
      <span class="login-item-label">用户名</span>
      <span class="login-item-input">
        <el-input placeholder="请输入用户名" v-model="username" maxlength="20"></el-input>
      </span>
    </div>
    <div class="login-item">
      <span class="login-item-icon">
        <img src="../assets/img/login/login-1.png" style="width: 0.17rem; height: 0.18rem" />
      </span>
      <span class="login-item-label">密码</span>
      <span class="login-item-input">
        <el-input placeholder="请输入密码" v-model="password" maxlength="20" type="password"></el-input>
      </span>
    </div>

    <el-button class="login-button" :loading="loginLoading" @click="submit"> 登录 </el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { validateFun } from '../utils/verify';

export default {
  name: 'AppLoginUserName',
  data: () => ({
    password: '', // 密码
    username: '' // 账号
  }),
  props: {
    // 登录页面的path
    registerPath: {
      type: String,
      default: 'register'
    }
  },
  computed: {
    ...mapGetters({
      loginLoading: 'user/LOGIN_LOADING',
      loginHint: 'user/LOGIN_HINT',
      loginShowHint: 'user/LOGIN_SHOW_HIN',
      isLoading: 'user/IS_LOGIN'
    })
  },
  methods: {
    ...mapMutations({
      setLoginHint: 'user/SET_LOGIN_HINT'
    }),
    ...mapActions({
      login: 'user/LOGIN'
    }),
    // 去注册
    navRegister() {
      this.$router.push(this.registerPath);
    },
    // 登录
    async submit() {
      try {
        const { username, password } = this;
        validateFun(this, {
          username: '账号', // 账号
          password: '密码' // 密码
        });
        await this.login({
          username,
          password,
          type: 'U'
        });
      } catch (e) {
        console.log(e.name);
        if (e.name === 'ValidError') {
          this.setLoginHint(e.message);
        } else {
          console.error(e);
        }
      }
    }
  }
};
</script>

<style scoped></style>

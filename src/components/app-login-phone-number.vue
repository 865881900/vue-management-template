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
    <!--  登录输入框  -->
    <div class="login-item">
      <span class="login-item-icon">
        <img src="../assets/img/login/login-3.png" style="width: 0.18rem; height: 0.18rem" />
      </span>
      <span class="login-item-label">手机号</span>
      <span class="login-item-input">
        <el-input placeholder="请输入手机号" v-model="phone" maxlength="11"></el-input>
      </span>
    </div>
    <div class="login-item" style="margin: 0">
      <span class="login-item-icon">
        <img src="../assets/img/login/login-1.png" style="width: 0.17rem; height: 0.18rem" />
      </span>
      <span class="login-item-label">短信验证码</span>
      <span class="login-item-input">
        <el-input placeholder="请输入登录码" v-model="verifyCode" maxlength="6"></el-input>
      </span>
      <span class="login-item-button">
        <el-button type="text" :disabled="codeState === 0" @click="getPhoneNumber">{{ iphoneCodeText }}</el-button>
      </span>
    </div>
    <el-button v-if="loginState === 0" class="login-button" :loading="loginLoading" @click="submit"> 登录 </el-button>
    <div v-if="loginState === 1" class="login-detection">智能检测中...</div>
    <app-move ref="move" @verification="loginBefore" v-if="loginState === 2"></app-move>
  </div>
</template>

<script>
import { isPhone, validateFun } from '../utils/verify';
import { APIRegister } from '../http/api';
import ValidError from '../utils/error/ValidError';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import appMove from './app-move';

export default {
  name: 'AppLoginPhoneNumber',
  components: { appMove },
  props: {
    // 登录页面的path
    registerPath: {
      type: String,
      default: 'register'
    }
  },
  data: () => ({
    phone: '13720777831',
    verifyCode: '',
    codeTime: 60, // 倒计时
    codeState: -1, // 验证码状态 -1: 还未获取; 0: 有效时间内; 1: 已经获取过一次,并且可以再次获取
    loginState: 0 // 手机号登录状态: 人工验证: 0: 未登录; 1: 人工验证; 2: 检测中
  }),
  beforeDestroy() {
    // 销毁为关闭的定时器任务
    this.clearIntervalId && clearInterval(this.clearIntervalId);
  },
  computed: {
    iphoneCodeText() {
      return this.codeState === 0 ? `${this.codeTime}s后重新获取` : this.codeState === -1 ? '获取验证码' : '重新获取';
    },
    ...mapGetters({
      loginLoading: 'user/LOGIN_LOADING',
      loginHint: 'user/LOGIN_HINT',
      loginShowHint: 'user/LOGIN_SHOW_HIN',
      isLoading: 'user/IS_LOGIN'
    })
  },
  watch: {
    isLoading(v) {
      if (v === true) {
        this.loginState = 1;
        let id = setTimeout(() => {
          this.loginState = 2;
          clearTimeout(id);
        }, 2000);
      }
    }
  },
  methods: {
    ...mapMutations({
      setLoginHint: 'user/SET_LOGIN_HINT'
    }),
    ...mapActions({
      login: 'user/LOGIN',
      loginBefore: 'user/LOGIN_BEFORE'
    }),
    // 去注册
    navRegister() {
      this.$router.push(this.registerPath);
    },
    // 获取手机号验证码
    async getPhoneNumber() {
      try {
        const { phone, codeState } = this;
        if (codeState === 0) {
          throw new ValidError('验证码还在有效期内');
        }
        // 校验手机号是否正确
        isPhone(phone);
        // 获取验证码
        const { code, message } = await APIRegister.validationCode({
          phoneNumber: phone,
          sendType: '1'
        });
        if (code === 0) {
          this.createCodeTime();
          this.$message.success('验证码已发送');
        } else {
          if (code === 400) {
            this.showButton = true;
          }
          throw new ValidError(message);
        }
      } catch (e) {
        if (e.name === 'ValidError') {
          this.setLoginHint(e.message);
        } else {
          console.error(e);
        }
      }
    },
    // 开启定时任务
    createCodeTime() {
      this.codeState = 0;
      this.codeTime = 60;
      this.clearIntervalId = setInterval(() => {
        if (this.codeTime === 0) {
          clearInterval(this.clearIntervalId);
          this.clearIntervalId = '';
          this.codeTime = 0;
          this.codeState = 1;
        }
        this.codeTime -= 1;
      }, 1000);
    },
    // 登录
    async submit() {
      try {
        const { phone, verifyCode } = this;
        validateFun(this, {
          phone: '手机号', // 手机号
          verifyCode: '短信验证码' // 短信验证码
        });
        isPhone(phone);
        await this.login({
          phone,
          verifyCode,
          type: 'P'
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

<style scoped>
</style>

<!--
/**
@template: 注册
@author: ChaoPengWang(wangcp-a@glodon.com)
@update: 2023/1/17 9:36 PM
-->


<template>
<c-login title="专家注册" :hintMessage="hintMessage" @clearHint="clearHint">
  <template v-slot:hintButton>
    <el-button class="error-hint-button" type="text" icon-right="el-icon-arrow-right" v-if="isShowHintButton"
               @click="navLogin"
    >立即登陆
    </el-button>
  </template>
  <template v-if="!isRegister">
    <div class="login-item">
    <span class="login-item-icon">
      <img src="../../assets/img/login/login-3.png" style="width: 0.18rem; height: 0.18rem">
    </span>
      <span class="login-item-label">专家姓名</span>
      <span class="login-item-input">
      <el-input placeholder="请输入专家姓名" v-model="registerFrom.expertName" maxlength="11"></el-input>
    </span>
    </div>

    <div class="login-item">
    <span class="login-item-icon">
      <img src="../../assets/img/login/login-3.png" style="width: 0.18rem; height: 0.18rem">
    </span>
      <span class="login-item-label">身份证号码</span>
      <span class="login-item-input">
      <el-input placeholder="请输入身份证号码" v-model="registerFrom.expertIdCard" maxlength="18"></el-input>
    </span>
    </div>

    <div class="login-item">
    <span class="login-item-icon">
      <img src="../../assets/img/login/login-3.png" style="width: 0.18rem; height: 0.18rem">
    </span>
      <span class="login-item-label">联系手机号</span>
      <span class="login-item-input">
      <el-input placeholder="请输入联系手机号" v-model="registerFrom.phoneNumber" maxlength="11"></el-input>
    </span>
    </div>

    <div class="login-item">
    <span class="login-item-icon">
      <img src="../../assets/img/login/login-3.png" style="width: 0.18rem; height: 0.18rem">
    </span>
      <span class="login-item-label">短信验证码</span>
      <span class="login-item-input">
      <el-input placeholder="请输入短信验证码" v-model="registerFrom.validateCode" maxlength="6"></el-input>
    </span>
      <span class="login-item-button">
      <el-button type="text" :disabled="codeTime > -1" @click="getIphoneCode">{{ iphoneCodeText }}</el-button>
    </span>
    </div>
  </template>
  <div v-else class="register-ok">
    <i class="el-icon-success"></i>
    <div>注册成功！</div>
    <p>{{ registerTime }}s后自动跳转到登录界面</p>
  </div>

  <template v-if="!isRegister">
    <el-button class="login-button" @click="register" :disabled="registerLoading">提交注册</el-button>
    <el-button class="register-button" type="text" icon-right="el-icon-arrow-right" @click="navLogin">已有账号，返回登陆
    </el-button>
  </template>
  <template v-else>
    <el-button class="login-button" @click="navLogin">返回登录</el-button>
  </template>

</c-login>
</template>
<script>
import cLogin from './components/c-login';
import {APIRegister} from '../../axios/apiMap';
import {validateFun} from './utils';
import ValidError from '../../util/ValidError';

const _IDRe18 = /^([1-9]\d{5}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])$/;
const _IDre15 = /^([1-9]\d{5}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3})$/;

export default {
  name: 'register',
  components: {
    cLogin,
  },
  computed: {
    iphoneCodeText() {
      return this.codeTime > -1 ? this.codeTime + 's后重新获取' : this.codeTime === -1 ? '获取验证码' : '重新获取';
    },
  },
  data: () => ({
    hintMessage: {
      type: '',
      text: '',
    },
    isShowHintButton: false,
    codeTime: -1,
    // 注册
    registerFrom: {
      expertIdCard: '', // 专家证件号
      expertName: '', // 专家姓名
      phoneNumber: '',// 手机号
      validateCode: '',// 验证码
    },
    registerLoading: false,
    isRegister: false, // 是否注册成功
    registerTime: -1,
  }),
  methods: {
    // 获取验证码
    async getIphoneCode() {

      const {phoneNumber} = this.registerFrom;
      try {
        if (this.codeTime > -1) {
          return;
        } else if (phoneNumber === '') {
          this.hintMessage = {
            type: 'getIphoneCode',
            text: '手机号不能为空',
          };
          return;
        } else if (!/^1\d{10}$/.test(phoneNumber)) {
          this.hintMessage = {
            type: 'getIphoneCode',
            text: '请输入正确的手机号',
          };
          return;
        }
        const {data: {message, code}} = await APIRegister.validationCode({
          phoneNumber,
          sendType: '0',
        });
        if (code === 0) {
          this.createCodeTime();
          if (this.hintMessage.type === 'getIphoneCode') {
            this.clearHint();
          }
          this.$message.success('验证码已发送');
        } else {
          this.hintMessage = {
            type: 'getIphoneCode',
            text: message,
          };
        }
        this.isShowHintButton = code === 400;
      } catch (e) {
        console.error(e);
      }
    },
    // 开启定时任务
    createCodeTime() {
      this.codeTime = 60;
      const id = setInterval(() => {
        if (this.codeTime === 0) {
          clearInterval(id);
          this.idList.forEach((item, index) => {
            if (item === id) {
              this.idList.splice(index, 1);
            }
          });
          this.codeTime = -2;
        } else {
          this.codeTime -= 1;
        }
      }, 1000);
      this.idList.push(id);
    },
    // 注册账号
    async register() {
      if (!this.validate()) {
        return;
      }
      try {
        this.registerLoading = true;
        const {data: {message, code}} = await APIRegister.expert(this.registerFrom);
        if (code === 0) {
          // 注册成功
          this.clearHint();
          this.isRegister = true;
          this.autoGoLoginPage();
        } else {
          this.hintMessage = {
            type: 'register',
            text: message,
          };
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.registerLoading = false;
      }
    },
    // 校验表单
    validate() {
      try {
        validateFun(this.registerFrom, {
          expertName: '专家姓名', // 专家姓名
          expertIdCard: '专家证件号', // 专家证件号
          phoneNumber: '联系手机号',// 手机号
          validateCode: '短信验证码',// 验证码
        });
        const {expertIdCard, phoneNumber} = this.registerFrom;


        if (!(_IDRe18.test(expertIdCard) || _IDre15.test(expertIdCard))) {
          throw new ValidError('专家证件号格式错误');
        }
        if (!/^1\d{10}$/.test(phoneNumber)) {
          throw new ValidError('手机号错误格式有误');
        }
        // 校验通过, 关闭校验提示
        if (this.hintMessage.type === 'validate') {
          this.clearHint();
        }
        return true;
      } catch (e) {
        if (e.name === 'ValidError') {
          this.hintMessage = {
            type: 'validate',
            text: e.message,
          };
        } else {
          console.error(e);
        }
        return false;
      }
    },

    // 去登录
    navLogin() {
      this.$router.push('login');
    },
    // 关闭提示
    clearHint() {
      this.hintMessage = {};
    },
    // 自动转到登录页面
    autoGoLoginPage() {
      this.registerTime = 3;
      const id = setInterval(() => {
        if (this.registerTime === 0) {
          clearInterval(id);
          this.$router.push('/login');
          this.idList.forEach((item, index) => {
            if (item === id) {
              this.idList.splice(index, 1);
            }
          });
        } else {
          this.registerTime -= 1;
        }
      }, 1000);
      this.idList.push(id);
    },
  },

  created() {
    this.idList = [];
  },

  beforeDestroy() {
    this.idList.forEach((id) => {
      clearInterval(id);
    });
  },

};
</script>

<style scoped lang="scss">
.register-ok {
  height: calc(2.6rem + 4px);
  font-size: 0.2rem;
  text-align: center;
  padding-top: 0.7rem;

  i {
    font-size: 0.46rem;
    color: #3DC348;
    display: block;
  }

  div {
    font-weight: bold;
    margin: 0.2rem 0;
  }
}

.login-item-icon {
  display: none;
}

.login-item-label {
  &:before {
    content: "*";
    color: #E82F2F;
    margin-right: 4px;
  }
}

.login-item-input {
  flex: 1;
}
</style>

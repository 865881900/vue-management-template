<!--
/**
@template: 登录页
@author: ChaoPengWang(wangcp-a@glodon.com)
@update: 2023/1/17 9:36 PM
-->
<template>
  <app-login title="登录" :hint-message="hintMessage.text" @clearHint="clearHint">
    <!-- 切换登录方式 -->
    <div class="login-mode">
      <div :class="{ 'is-select': loginMode === 'SJH' }" @click="setLoginMode('SJH')">手机号登录</div>
      <div :class="{ 'is-select': loginMode === 'ZH' }" @click="setLoginMode('ZH')">账号登录</div>
      <div :class="{ 'is-select': loginMode === 'CA' }" @click="setLoginMode('CA')">CA锁登录</div>
      <div
        class="login-mode-icon"
        :style="{
          transform: transformPX
        }"
      ></div>
    </div>

    <template v-slot:hintButton>
      <el-button
        class="error-hint-button"
        type="text"
        icon-right="el-icon-arrow-right"
        v-if="isShowHintButton"
        @click="navRegister"
      >
        立即注册
      </el-button>
    </template>

    <!-- 手机号登录 -->
    <!-- 账号登录 -->
    <template v-else-if="loginMode === 'ZH'">
      <div class="login-item">
        <span class="login-item-icon">
          <img src="./login-3.png" style="width: 0.18rem; height: 0.18rem" />
        </span>
        <span class="login-item-label">用户名</span>
        <span class="login-item-input">
          <el-input placeholder="请输入用户名" v-model="loginFromData.username" maxlength="20"></el-input>
        </span>
      </div>
      <div class="login-item">
        <span class="login-item-icon">
          <img src="./login-1.png" style="width: 0.17rem; height: 0.18rem" />
        </span>
        <span class="login-item-label">密码</span>
        <span class="login-item-input">
          <el-input placeholder="请输入密码" v-model="loginFromData.password" maxlength="20" type="password"></el-input>
        </span>
      </div>
    </template>
    <!-- CA登录 -->
    <template v-if="loginMode === 'CA'">
      <div class="glo-layout__main__tips">
        请确保CA数字证书已和电脑相连，并已正确安装对应的驱动程序
        <span class="login-downca" @click="downloadCA">下载CA锁驱动</span>
      </div>
      <div class="login-item">
        <span class="login-item-icon">
          <img src="./login-1.png" style="width: 0.17rem; height: 0.18rem" />
        </span>
        <span class="login-item-label">密码</span>
        <span class="login-item-input">
          <el-input
            placeholder="请输入登录码"
            v-model="loginFromData.CAPassword"
            maxlength="10"
            type="password"
          ></el-input>
        </span>
      </div>
    </template>

    <el-button
      v-if="(loginMode === 'SJH' && SJHLoginState === 0) || loginMode !== 'SJH'"
      class="login-button"
      :disabled="loginLoading"
      @click="loginSubmit(loginMode)"
    >
      登录
    </el-button>
    <el-button class="register-button" type="text" @click="navRegister">立即注册</el-button>
  </app-login>
</template>

<script>
import { JSEncrypt } from '../../../static/jsencrypt/jsencrypt.min.js';
import appLogin from '@/components/app-Login';
import appMove from '@/components/app-move';
import { APIRegister } from '@api';
import { validateFun } from '../../utils';
import '../../../static/ca/gzca.js';
import ValidError from '../../utils/error/ValidError';

const transformPXMap = {
  SJH: '0',
  ZH: '100',
  CA: '200'
};

const validateMap = {
  SJH: {
    phoneNumber: '手机号', // 手机号
    validateCode: '短信验证码' // 短信验证码
    // phoneCode: '验证码', // 验证码
  },
  ZH: {
    username: '账号', // 账号
    password: '密码' // 密码
  },
  CA: {
    CAPassword: '密码' // 密码
  }
};

const allowRoles = [];

export default {
  name: 'Login',
  components: {
    appLogin,
    appMove
  },
  computed: {
    iphoneCodeText() {
      return this.codeTime > -1 ? `${this.codeTime}s后重新获取` : this.codeTime === -1 ? '获取验证码' : '重新获取';
    },
    transformPX() {
      return `translateX(${transformPXMap[this.loginMode]}%)`;
    }
  },
  data: () => ({
    loginMode: 'SJH', // SJH: 手机号登录; ZH: 账号登录; CA: ca锁登录;
    loginLoading: false,
    SJHLoginState: 0, // 0: 待验证 1: 验证 2: 登录按钮;
    codeUrl: 'http://10.0.168.72/gdw/platform/getKaptchaImage?_1673936910487', // 验证码
    codeTime: -1,
    loginFromData: {
      phoneNumber: '', // 手机号
      validateCode: '', // 短信验证码
      phoneCode: '', // 验证码
      password: '',
      username: '',
      CAPassword: '' // CA锁密码
    },
    hintMessage: {}, // 错误提示
    isShowHintButton: false,
    allowRoles: allowRoles // 允许登录的角色
  }),
  methods: {
    /** 工具函数 */
    // 验证表单
    validate(loginMode) {
      try {
        validateFun(this.loginFromData, validateMap[loginMode]);
        const { phoneNumber } = this.loginFromData;
        if (loginMode === 'SJH') {
          if (!/^1\d{10}$/.test(phoneNumber)) {
            throw new ValidError('手机号错误格式有误');
          }
        }
        // 校验通过, 取消校验提示
        if (this.hintMessage.type === 'validate') {
          this.clearHint();
        }
        return true;
      } catch (e) {
        if (e.name === 'ValidError') {
          this.hintMessage = {
            type: 'validate',
            text: e.message
          };
        } else {
          console.error(e);
        }
        return false;
      }
    },
    /** 手机号登录 */
    // 获取验证码
    async getIphoneCode() {
      try {
        const { phoneNumber } = this.loginFromData;
        if (this.codeTime > -1) {
          return;
        } else if (phoneNumber === '') {
          this.hintMessage = {
            type: 'getIphoneCode',
            text: '手机号不能为空'
          };
          return;
        } else if (!/^1\d{10}$/.test(phoneNumber)) {
          this.hintMessage = {
            type: 'getIphoneCode',
            text: '请输入正确的手机号'
          };
          return;
        }

        const {
          data: { message, code }
        } = await APIRegister.validationCode({
          phoneNumber,
          sendType: '1'
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
            text: message
          };
        }
        this.isShowHintButton = code === 400;
      } catch (e) {
        console.error(e);
      }
    },
    // 手机号登录
    // eslint-disable-next-line camelcase
    async loginSubmit_SJH() {
      const { phoneNumber, validateCode } = this.loginFromData;
      await this.toLogin({
        phone: phoneNumber,
        verifyCode: validateCode
      });
    },

    // 登录
    async loginSubmit(loginMode) {
      if (!this.validate(loginMode)) {
        return;
      }
      try {
        this.loginLoading = true;
        await this[`loginSubmit_${loginMode}`]();
      } catch (e) {
        console.error(e);
      } finally {
        this.loginLoading = false;
      }
    },

    // 账号登录
    // eslint-disable-next-line camelcase
    async loginSubmit_ZH() {
      const {
        data: { public_key: publicKey, code, message }
      } = await APIRegister.getPublicKey();
      if (code !== 0) {
        this.$message.warning(message);
      }
      const { password, username } = this.loginFromData;
      await this.toLogin({
        username,
        password: this.encryptedData(publicKey, password)
      });
    },
    /** ca登录 */
    // ca登录
    // eslint-disable-next-line camelcase
    async loginSubmit_CA() {
      this.caCertInit();
    },
    // CA验证及初始化信息
    caCertInit() {
      const _this = this;
      // CA-获取证书所在容器名
      const Cert = Object.create(window.GZCA); // 创建一个新的Cert对象，关联全局对象GZCA，防止全局对象的方法和属性被篡改
      Cert.init((res) => {
        if (!res) {
          return;
        }
        /* 获取证书所在容器名 */
        Cert.GZCA_GetContainerName(true, 1, (res) => {
          if (res.success) {
            _this.containerName = res.ContainerName;
            /* 登录验证 */
            Cert.GZCA_Login_PIN(_this.containerName, _this.loginFromData.CAPassword, (res) => {
              if (res.success) {
                // 登录成功-导出证书
                Cert.GZCA_ExportCert(_this.containerName, '1', (res) => {
                  if (res.success) {
                    _this.CertB64 = res.CertB64; // base64编码的证书
                    // 获取证书信息
                    Cert.GZCA_GetCertInfo(_this.CertB64, (res) => {
                      if (res.success) {
                        _this.certNo = res.CertSerial; // 证书序列号
                        if (res.CertSubject) {
                          const nameStr = res.CertSubject.substring(
                            res.CertSubject.indexOf('CN=') + 3,
                            res.CertSubject.length
                          );
                          if (nameStr) {
                            _this.enterpriseName = nameStr.split(',')[0];
                          } else {
                            _this.enterpriseName = '';
                          }
                        }
                        // 获取随机数
                        _this.caLoginInitData(_this, Cert);
                      } else {
                        _this.$message({ message: res.msg, type: 'error' });
                      }
                    });
                  } else {
                    _this.$message({ message: res.msg, type: 'error' });
                  }
                });
              } else {
                _this.$message({ message: res.msg, type: 'error' });
              }
            });
          } else {
            Cert.GZCA_Msg(res.msg);
            alert('客户端未运行');
          }
        });
      });
    },
    // CA 随机数获取
    async caLoginInitData(_this, Cert) {
      // Pkcs#1数字签名
      const { data: resp } = await APIRegister.getCARandom();
      if (resp.success) {
        _this.randomNum = resp.data; // 随机数
        // 验签
        Cert.GZCA_IsLogin(_this.containerName, (res) => {
          if (res.isLogin) {
            signData(_this.containerName, _this.randomNum);
          } else {
            Cert.GZCA_Login(_this.containerName, (res) => {
              if (res.success) {
                signData(_this.containerName, _this.randomNum);
              } else {
                _this.$message({ message: res.msg, type: 'error' });
              }
            });
          }

          function signData(ContainerName, Data) {
            Cert.GZCA_Pkcs1SignData(ContainerName, Data, (res) => {
              if (res.success) {
                _this.signature = res.SignData; // 签名
                _this.caCheckAndLogin(_this);
              } else {
                _this.$message({ message: res.msg, type: 'error' });
              }
            });
          }
        });
      } else {
        _this.$message({ message: resp.message, type: 'error' });
      }
    },
    // CA登录验证
    async caCheckAndLogin(_this) {
      this.loading = true;
      const obj = {
        certNo: _this.certNo,
        randomNum: _this.randomNum,
        signature: _this.signature,
        enterpriseName: _this.enterpriseName,
        certBase64: _this.CertB64
      };
      _this.toLogin(obj);
    },
    async toLogin(param) {
      const {
        data: { code, msg }
      } = await APIRegister.toLogin(param);
      if (code === 0) {
        if (this.loginMode === 'SJH') {
          this.setSJHLoginState(1);
          const id = setTimeout(() => {
            this.setSJHLoginState(2);
            clearTimeout(id);
          }, 2000);
        } else {
          this.selectSystem();
        }
      } else {
        this.hintMessage = {
          type: 'loginSubmit',
          text: msg
        };
      }
      this.isShowHintButton = code === 400;
    },

    /** 验证 */
    setSJHLoginState(state) {
      this.SJHLoginState = state;
    },

    // 获取用户信息, 导航等
    async selectSystem() {
      const {
        data: { code, sysInfo, msg, identify },
        data
      } = await APIRegister.getIndexData();

      if (code === 0) {
        sessionStorage.setItem('organCode', identify.organCode); // 代理机构账户信息接口需要该参数
        window.localStorage.roleCode = identify.roleCode;
        if (sysInfo.systemCode === 'G3_EXPERTFEE') {
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          });
          this.$router.push({
            name: 'index'
          });
        } else {
          // 处理角色身份问题
          this.identityHandled(data);
        }
      } else {
        this.$message.warning(msg);
      }
    },

    // 处理角色身份问题
    identityHandled(res) {
      const roleIdentifys = [];
      res.identifys.forEach((r) => {
        if (this.allowRoles.indexOf(r.roleCode) != -1) {
          roleIdentifys.push(r.id);
        }
      });
      if (roleIdentifys.length == 0) {
        this.$confirm('无效的专家费角色，请联系管理员！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 跳转统一注册
          window.open(res.sysInfo.webUrl, '_blank');
        });
        return;
      }
      // 切换身份
      this.switchIdentity(roleIdentifys[0]);
    },
    // 切换身份
    async switchIdentity(id) {
      const {
        data: { code, message }
      } = await APIRegister.switchIdentity({
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
    },

    /**
     * 工具函数
     */
    // 去注册
    navRegister() {
      this.$router.push('register');
    },
    // 清除错误提示
    clearHint() {
      this.hintMessage = {};
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
        }
        this.codeTime -= 1;
      }, 1000);
      this.idList.push(id);
    },

    // 修改登录方式
    setLoginMode(loginMode) {
      this.loginMode = loginMode;
    },

    // 加密
    encryptedData(publicKey, data) {
      // 新建JSEncrypt对象
      const encryptor = new JSEncrypt();
      // 设置公钥
      encryptor.setPublicKey(publicKey);
      // 加密数据
      return encryptor.encrypt(data);
    },

    // 下载CA锁驱动
    downloadCA() {
      const _this = this;
      const url = '/expertfeeweb/static/file/ca/cadriver.zip';
      if (this.IEVersion() === -1) {
        // 发送http请求，将文件链接转换成文件流
        this.fileAjax(
          url,
          (xhr) => {
            _this.downloadFile(xhr.response, 'CA锁驱动.zip');
          },
          {
            responseType: 'blob'
          }
        );
      } else {
        window.open(url, '_blank');
      }
    },
    fileAjax(url, callback, options) {
      const xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      if (options.responseType) {
        xhr.responseType = options.responseType;
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(xhr);
        }
      };
      xhr.send();
    },
    IEVersion() {
      const { userAgent } = navigator; // 取得浏览器的userAgent字符串
      const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
      const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
      const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
      if (isIE) {
        const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(userAgent);
        const fIEVersion = parseFloat(RegExp['$1']);
        if (fIEVersion == 7) {
          return 7;
        } else if (fIEVersion == 8) {
          return 8;
        } else if (fIEVersion == 9) {
          return 9;
        } else if (fIEVersion == 10) {
          return 10;
        }
        return 6; // IE版本<=7
      } else if (isEdge) {
        return 'edge'; // edge
      } else if (isIE11) {
        return 11; // IE11
      }
      return -1; // 不是ie浏览器
    },
    downloadFile(content, filename) {
      window.URL = window.URL || window.webkitURL;
      const a = document.createElement('a');
      const blob = new Blob([content]);
      // 通过二进制文件创建url
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      // 销毁创建的url
      window.URL.revokeObjectURL(url);
    }
  },
  created() {
    this.idList = [];
  },
  beforeDestroy() {
    this.idList.forEach((id) => {
      clearInterval(id);
    });
  }
};
</script>

<style scoped lang="scss">
.login-mode {
  font-size: 0.2rem;
  margin: 0.1rem 0 0.2rem;
  display: flex;
  justify-content: space-between;
  position: relative;

  & > div {
    width: 33.33%;
    text-align: center;
    cursor: pointer;
  }

  &:before {
    display: block;
    position: absolute;
    content: '';
    background: #e6e6e6;
    width: 100%;
    height: 1px;
    bottom: -7px;
    left: 0;
  }

  .login-mode-icon {
    position: absolute;
    background: rgba(30, 131, 254, 0.89);
    width: 33.33%;
    height: 3px;
    bottom: -7px;
    left: 0;
    transition: transform 0.05s cubic-bezier(0.58, 0.08, 0.59, 1.03);
  }
}

.glo-layout__main__tips {
  background-position-y: top;
  margin-left: 0;
  margin: 0.2rem 0;
  font-size: 0.18rem;
  line-height: 0.22rem;
  background-size: 0.22rem;
  text-indent: 0.24rem;
}



.detection {
  width: 100%;
  height: 0.7rem;
  border-radius: 4px;
  color: #ffffff;
  margin-top: 0.5rem;
  margin-bottom: 0.1rem;
  background: linear-gradient(142deg, #35a6ff 0%, #197bfd 100%);
  box-shadow: 0px 8px 15px 0px rgba(15, 123, 247, 0.15);
  font-size: 0.24rem;
  font-weight: bold;
  line-height: 0.7rem;
  text-align: center;
}
</style>

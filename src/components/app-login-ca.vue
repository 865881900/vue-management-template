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

    <div class="el-icon-info hint">
      请确保CA数字证书已和电脑相连，并已正确安装对应的驱动程序
      <span class="login-downca" @click="downloadCA">下载CA锁驱动</span>
    </div>
    <div class="login-item">
      <span class="login-item-icon">
        <img src="../assets/img/login/login-1.png" style="width: 0.17rem; height: 0.18rem" />
      </span>
      <span class="login-item-label">密码</span>
      <span class="login-item-input">
        <el-input placeholder="请输入登录码" v-model="CAPassword" maxlength="10" type="password"></el-input>
      </span>
    </div>

    <el-button class="login-button" :loading="loginLoading" @click="submit"> 登录 </el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { validateFun } from '../utils/verify';
import { downloadFile } from '../utils/download';
import { APIRegister } from '../http/api';

export default {
  name: 'AppLoginUserName',
  data: () => ({
    CAPassword: '' // ca密码
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

    // 下载CA锁驱动
    downloadCA() {
      downloadFile('static/ca/cadriver.zip');
    },
    // 登录
    async submit() {
      try {
        validateFun(this, {
          CAPassword: 'ca密码' // ca密码
        });
        this.setLoginHint('');
        this.caCertInit();
      } catch (e) {
        console.log(e.name);
        if (e.name === 'ValidError') {
          this.setLoginHint(e.message);
        } else {
          console.error(e);
        }
      }
    },

    // CA验证及初始化信息
    caCertInit() {
      const that = this;
      // CA-获取证书所在容器名
      const Cert = Object.create(window.GZCA); // 创建一个新的Cert对象，关联全局对象GZCA，防止全局对象的方法和属性被篡改
      Cert.init((res) => {
        if (!res) {
          return;
        }
        /* 获取证书所在容器名 */
        Cert.GZCA_GetContainerName(true, 1, (res) => {
          if (res.success) {
            that.containerName = res.ContainerName;
            /* 登录验证 */
            Cert.GZCA_Login_PIN(that.containerName, that.password, (res) => {
              if (res.success) {
                // 登录成功-导出证书
                Cert.GZCA_ExportCert(that.containerName, '1', (res) => {
                  if (res.success) {
                    that.CertB64 = res.CertB64; // base64编码的证书
                    // 获取证书信息
                    Cert.GZCA_GetCertInfo(that.CertB64, (res) => {
                      if (res.success) {
                        that.certNo = res.CertSerial; // 证书序列号
                        if (res.CertSubject) {
                          const nameStr = res.CertSubject.substring(
                            res.CertSubject.indexOf('CN=') + 3,
                            res.CertSubject.length
                          );
                          if (nameStr) {
                            that.enterpriseName = nameStr.split(',')[0];
                          } else {
                            that.enterpriseName = '';
                          }
                        }
                        // 获取随机数
                        that.caLoginInitData(that, Cert);
                      } else {
                        that.$message({ message: res.msg, type: 'error' });
                      }
                    });
                  } else {
                    that.$message({ message: res.msg, type: 'error' });
                  }
                });
              } else {
                that.$message({ message: res.msg, type: 'error' });
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
    // eslint-disable-next-line consistent-this
    async caLoginInitData(that, Cert) {
      // Pkcs#1数字签名
      const { data: resp } = await APIRegister.getCARandom();

      function signData(ContainerName, Data) {
        Cert.GZCA_Pkcs1SignData(ContainerName, Data, (res) => {
          if (res.success) {
            that.signature = res.SignData; // 签名
            that.caCheckAndLogin(that);
          } else {
            that.$message({ message: res.msg, type: 'error' });
          }
        });
      }
      if (resp.success) {
        that.randomNum = resp.data; // 随机数
        // 验签
        Cert.GZCA_IsLogin(that.containerName, (res) => {
          if (res.isLogin) {
            signData(that.containerName, that.randomNum);
          } else {
            Cert.GZCA_Login(that.containerName, (res) => {
              if (res.success) {
                signData(that.containerName, that.randomNum);
              } else {
                that.$message({ message: res.msg, type: 'error' });
              }
            });
          }
        });
      } else {
        that.$message({ message: resp.message, type: 'error' });
      }
    },
    // CA登录验证
    // eslint-disable-next-line consistent-this
    async caCheckAndLogin(that) {
      this.loading = true;
      const obj = {
        certNo: that.certNo,
        randomNum: that.randomNum,
        signature: that.signature,
        enterpriseName: that.enterpriseName,
        certBase64: that.CertB64
      };
      this.login(obj);
    }
  }
};
</script>

<style scoped></style>

<template>
  <div class="login-page">
    <div>
      <div class="login-page_head"> 贵州公共资源交易监管平台</div>
      <div class="login-page_body">
        <!--背景图-->
        <div class="login-page_body-img">
          <div></div>
        </div>
        <!--登录框-->
        <div class="login-page_body-login display_flex flex-direction_column justify-content_flex-center">
          <div>
            <div class="login-title"><strong>欢迎登陆</strong></div>

            <div class="login-error">
              <el-alert
                title="请插入CA锁！"
                v-show="isShowNotCV"
                @close="isShowNotCV = false"
                type="error"
                show-icon
              ></el-alert>
            </div>
            <!-- src="@/assets/imgs/login/hint.png"-->
            <div class="login-hint display_flex">
              <img class="login-icon" />
              <div class="flex_1">
                请确保CA数字证书已和电脑相连，并已正确安装对应的驱动程序。
                <el-button type="text" @click="downloadCA" class="update_file">下载CA锁驱动</el-button>
              </div>
            </div>

            <el-input placeholder="请输入密码" v-model="password" v-show="false"></el-input>
            <el-input
              placeholder="请输入密码"
              v-model="password"
              type="password"
              style="margin-bottom: 156px"
              show-password
            >
              <template slot="prepend">
                <!--src="@/assets/imgs/login/pass.png" -->
                <img class="login-icon" style="transform: translateY(-2px)" />密码
              </template>
            </el-input>

            <el-button class="login-button" @click="caLogin">登录</el-button>

            <div class="login-link display_flex justify-content_flex-justify">
              <el-button type="text">忘记密码</el-button>
              <el-button type="text">立即注册</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="login-page_bottom display_flex flex-direction_column justify-content_flex-center align-items_center">
        <div>主办：贵州省公共资源交易中心 | 技术支持：广联达科技股份有限公司</div>
        <div>
          CopyRight © 2015 贵州省公共资源交易中心.All Rights Reserved 备案号：黔ICP备14002176号-2
          贵公网安备：52010202000320号
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: [],
  data() {
    return {};
  }
};
</script>
<style scoped lang="scss">
input {
  box-shadow: inset 0 0 0 1000px #f7f7f7 !important;
}

.login-page {
  height: 100%;
  width: 100%;
  background: #ffffff;
  overflow: auto;

  & > div {
    min-height: 900px;
    min-width: 1000px;

    .login-page_head {
      width: 100%;
      height: calc((100% - 715px) / 2);
      padding-top: 50.5px;
      padding-left: 60px;
      box-sizing: border-box;
      font-size: 40px;
      font-weight: bold;
      line-height: 36px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    }

    .login-page_body {
      height: 715px;
      padding: 15px 0;
      position: relative;

      .login-page_body-img {
        background: #fcfcfc;
        height: 685px;
        width: 100%;
        padding: 21px 0;

        & > div {
          height: 100%;
          width: 100%;
          //background: url('../../assets/imgs/login/login-back.png') no-repeat left top;
        }
      }

      .login-page_body-login {
        position: absolute;
        top: 0px;
        right: 9.3%;
        height: 100%;
        width: 552px;
        background-color: #ffffff;
        box-shadow: 10px 0px 40px 0px rgba(39, 100, 171, 0.2);
        border-radius: 2px;
        padding: 0 50px;
        box-sizing: border-box;

        .login-title {
          font-size: 32px;
          text-align: center;
          margin-bottom: 15px;

          strong {
            display: inline-block;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              display: block;
              top: 48px;
              width: 100%;
              height: 5px;
              background-color: #1e83fe;
            }
          }
        }

        .login-error {
          height: 50px;
          margin-bottom: 10px;

          ::v-deep .el-alert--error.is-light {
            height: 100%;
            line-height: 50px;

            .el-alert__title {
              font-size: 16px;
              color: #ff4b53;
            }

            .el-icon-close {
              top: 19px;
            }
          }
        }

        .login-hint {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #999999;
          line-height: 22px;
          margin-bottom: 52px;

          & > img {
            margin-top: 4px;
          }

          .update_file {
            display: inline-block;
            line-height: 22px;
            height: 22px;
            padding: 0px;
          }
        }

        .login-button {
          width: 452px;
          height: 70px;
          background: linear-gradient(142deg, #35a6ff 0%, #197bfd 100%);
          box-shadow: 0px 8px 15px 0px rgba(15, 123, 247, 0.15);
          border-radius: 4px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 20px;
          margin-bottom: 19px;
        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          left: -26px;
          top: 0px;
          height: 0px;
          width: 0px;
          border-bottom: 18px solid #0c53a8;
          border-right: 13px solid #0c53a8;
          border-top: 18px solid transparent;
          border-left: 13px solid transparent;
        }
      }
    }

    .login-page_bottom {
      width: 100%;
      height: calc((100% - 715px) / 2);
      box-sizing: border-box;
      font-size: 14px;
      line-height: 25px;
      text-align: center;
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
}

.login-icon {
  height: 14px;
  width: 14px;
  display: inline-block;
  margin-right: 10px;
}

.el-button {
  color: #1e83fe;
  font-size: 16px;

  :hover {
    text-decoration: underline;
  }
}

.el-input-group {
  border-top: none;
  border-left: none;
  border-right: none;
  margin-bottom: 20px;
  height: 43px;
  font-family: MicrosoftYaHei;

  ::v-deep .el-input-group__prepend {
    font-size: 16px;
    padding: 0 20px 0 0;
    color: #333333;
    width: 80px;
    box-sizing: border-box;
  }

  & > ::v-deep .el-input__inner {
    line-height: 43px;
    height: 43px;
    background: none !important;
  }
}
</style>

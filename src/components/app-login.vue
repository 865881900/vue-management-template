<!--
/**
@template: 登录组件
@author: ChaoPengWang(wangcp-a@glodon.com)
@update: 2023/1/17 9:36 PM
-->
<template>
  <div class="login-page">
    <div class="login-head">
      <div>
        <p>贵州省公共资源交易网</p>
        <p class="name-e">Guizhou Public Resources Trading Center</p>
      </div>
      <div>专家费管理系统</div>
    </div>
    <div class="login-body">
      <div class="login-component">
        <slot />
      </div>
    </div>
    <div class="login-footer">
      <div class="login-footer-2">
        <span>主办：贵州省公共资源交易中心</span>
        <span class="login-footer-2-midden"></span>
        <span>技术支持：广联达科技股份有限公司</span>
      </div>
      <div class="login-footer-2">
        <span>CopyRight © 2015 贵州省公共资源交易中心.ALL Rights Reserved</span>
        <span>备案号：黔ICP备14002176号-2</span>
        <span>贵公网安备：52010202000320</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppLogin'
};
</script>

<style scoped lang="scss">
.login-page {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  .login-head {
    width: 100%;
    height: 1.8rem;
    padding-left: 0.6rem;
    display: flex;
    align-items: center;
    font-size: 0.35rem;
    font-weight: bold;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    letter-spacing: -0.02rem;

    & > div:first-child {
      padding-right: 0.07rem;
      border-right: 0.02rem solid;
      margin-right: 0.07rem;

      .name-e {
        font-size: 0.16rem;
        text-align: center;
        letter-spacing: 0rem;
      }
    }
  }

  .login-body {
    background-image: url('../assets/img/login/login-back.png');
    width: 100%;
    height: 7.15rem;
    max-height: calc(100% - 3.2rem);
    min-height: 500px;
    background-size: 100% calc(100% - 72px);
    background-position: 0 36px;
    background-repeat: no-repeat;

    .login-component {
      height: 100%;
      margin-left: 56%;
      width: 5.52rem;
      background: #fff;
      position: relative;
      box-shadow: 10px 0px 40px 0px rgba(39, 100, 171, 0.2);
      border-radius: 0 2px 2px 2px;
      padding: 0.6rem 0.7rem;
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        top: 0;
        left: -26px;
        border-right: 13px solid #0c53a8;
        border-left: 13px solid transparent;
        border-bottom: 18px solid #0c53a8;
        border-top: 18px solid transparent;
      }
    }
  }

  .login-footer {
    height: 1.6rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 0.14rem;

    .login-footer-2 {
      display: flex;
      margin-bottom: 5px;

      span {
        margin: 0 0.1rem;
      }

      .login-footer-2-midden {
        height: 100%;
        width: 1px;
        background: #333333;
        display: inline-block;
      }
    }
  }
}

@keyframes error-hint-animation-name {
  to {
    opacity: 1;
  }
  from {
    opacity: 0;
  }
}
</style>

<style lang="css">
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
}
</style>

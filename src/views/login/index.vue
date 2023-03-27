<!-- 登录页 -->
<template>
  <app-login>
    <div class="login-component-title">
      <span>登录</span>
    </div>
    <app-login-phone-number style="display: none" />
    <app-login-user-name style="display: none" />
    <app-login-ca />
  </app-login>
</template>
<script>
import AppLoginPhoneNumber from '@/components/app-login-phone-number';
import AppLogin from '@/components/app-login';
import AppLoginUserName from '@/components/app-login-user-name';
import AppLoginCa from '@/components/app-login-ca';

export default {
  name: 'Login',
  components: {
    AppLoginPhoneNumber,
    AppLoginUserName,
    AppLoginCa,
    AppLogin
  },
  data: () => ({})
};
</script>

<style scoped lang="scss"></style>

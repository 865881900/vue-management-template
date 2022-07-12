<!--
@template: 入口vue
@author: ChaoPengWang(wangcp-a@glodon.com)
@update: 2022/4/16 9:36 PM
-->
<template>
  <div class="a">
    框架首页
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'Main',
  created() {},
  watch: {
    '$dynamicRouter.menuList'(l, n) {
      console.log(l, n, '监听变化');
    }
  },
  methods: {}
};
</script>

<style></style>

<template>
  <div id="hello">你好vue</div>
</template>

<script type="application/javascript">
  import a from '@/a.js';
  export default {
    name: 'Main',
    created() {
      console.log(a);
    }
  };
</script>

<style>
  #hello {
    color: red;
  }
</style>

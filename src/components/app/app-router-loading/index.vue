<!--
	@file: 给router-view中的组件添加蒙层效果
	根据该路由中的http所有的请求状态, 判断是否显示蒙层
	当路由组件中有http请求未完成,则展示loading组件
	当路由组件中的所有http请求完成,则显示该组件
	@author: ChaoPengWang(wangcp-a@glodon.com)
	@update: 2022/4/14 6:32 PM
-->

<template>
  <div class="app-loading display_flex">
    <slot name="default"></slot>
    <div class="app-loading-membrane" v-show="routerQueue.length > 0 && !isOverlook && notShow">
      <slot name="loading">
        <div class="app-loading-def display_flex flex-direction_column align-items_center" ref="loadingDef">
          <i class="el-icon-loading" />
          <div style="margin-bottom: 10px">加载中...</div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BaseRouterLoading',
  props: {
    // 数组中包含的路由路径,将忽略该功能;
    overlookPath: {
      type: Array,
      default: () => []
    },

    // 正则匹配路由路径成功,忽略该功能;
    overlookRegExp: {
      type: RegExp,
      default: null
    },

    intervalTime: {
      type: Number,
      default: 100
    }
  },

  computed: {
    isOverlook() {
      return (
        (this.overlookRegExp ? this.overlookRegExp.test(this.toPath) : false) || this.overlookPath.includes(this.toPath)
      );
    }
  },

  watch: {
    isOverlook() {
      this.noScroll();
    },
    routerQueue() {
      this.noScroll();
    },
    notShow() {
      this.noScroll();
    }
  },

  methods: {
    noScroll() {
      if (this.notShow && this.routerQueue.length > 0 && !this.isOverlook) {
        document.querySelector('HTML').style.overflow = 'hidden';
      } else {
        document.querySelector('HTML').style.overflow = 'auto';
      }
    }
  }
};
</script>

<style lang="css">
.app-loading {
  width: 100%;
  height: 100%;
}
.app-loading-membrane {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  width: 100%;
  height: 100%;
  color: rgb(24 14 255);
  background: rgb(0 0 0 / 50%);
  justify-content: center;
  align-items: center;
}
.app-loading-def {
  height: 50px;
  color: #fff;
}
.app-loading-def > i {
  font-size: 42px;
  color: #fff;
}

@keyframes mymove {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div id="box">
    <div class="bgColor" :class="{ bgColorS: isShow }" />
    <div class="txt" :class="{ 'el-icon-success': isShow }"> 请按住滑块，拖动到最右边 </div>
    <div class="slider" :class="{ 'slider-hide': isShow }" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSuccess: false,
      isShow: false,
      box: '', // 容器
      bgColor: '', // 背景色
      txt: '', // 文本
      slider: '', // 滑块
      successMoveDistance: '', // 解锁需要滑动的距离
      downX: '' // 用于存放鼠标按下时的位置
    };
  },
  mounted() {
    // 二、获取到需要用到的DOM元素
    this.box = this.getEle('#box'); // 容器
    this.bgColor = this.getEle('.bgColor'); // 背景色
    this.txt = this.getEle('.txt'); // 文本
    this.slider = this.getEle('.slider'); // 滑块

    this.successMoveDistance = this.box.offsetWidth - this.slider.offsetWidth; // 解锁需要滑动的距离
    // 三、给滑块添加鼠标按下事件
    this.slider.onmousedown = this.mousedownHandler;
    this.slider.ontouchstart = this.mousedownHandler; // 移动端加touchstart事件
  },
  methods: {
    defaultInit() {
      this.isSuccess = false;
      this.bgColor.style.width = '0.7rem';
      this.slider.style.left = '-0.04rem';
      this.slider.style.borderRadius = '4px';
      this.txt.innerHTML = '请按住滑块，拖动到最右边';
      this.txt.style.color = '#33333';
      // 三、给滑块添加鼠标按下事件
      this.slider.onmousedown = this.mousedownHandler;
      this.slider.ontouchstart = this.mousedownHandler; // 移动端加touchstart事件
      this.isShow = false;
    },
    // 一、定义了一个获取元素的方法
    getEle(selector) {
      return document.querySelector(selector);
    },
    // 3.1鼠标按下事件的方法实现
    mousedownHandler(_e) {
      this.bgColor.style.transition = '';
      this.slider.style.transition = '';
      const e = _e || window.event || _e.which;
      this.downX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
      if (!this.isSuccess) {
        // 在鼠标按下时，分别给鼠标添加移动和松开事件
        document.onmousemove = this.mousemoveHandler;
        document.onmouseup = this.mouseupHandler;
        // 添加移动端对应事件
        document.ontouchmove = this.mousemoveHandler;
        document.ontouchend = this.mouseupHandler;
      }
    },
    // 3.1.1鼠标移动事件的方法实现
    mousemoveHandler(_e) {
      debugger;
      const e = _e || window.event || _e.which;
      const moveX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
      const offsetX = this.getOffsetX(moveX - this.downX, 0, this.successMoveDistance);
      this.bgColor.style.width = `calc( ${offsetX}px + 0.7rem )`;
      this.slider.style.left = `calc( ${offsetX}px + 0.04rem )`;

      if (offsetX == this.successMoveDistance) {
        this.success();
      }
      // 如果不设置滑块滑动时会出现问题（目前还不知道为什么）
      e.preventDefault();
    },
    // 3.1.2鼠标松开事件的方法实现
    mouseupHandler() {
      if (!this.isSuccess) {
        this.bgColor.style.transition = 'width 0.5s linear';
        this.bgColor.style['-weblit-transition'] = 'width 0.5s linear';
        this.bgColor.style['-o-transition'] = 'width 0.5s linear';
        this.bgColor.style['-moz-transition'] = 'width 0.5s linear';
        this.bgColor.style['-ms-transition'] = 'width 0.5s linear';

        this.slider.style.transition = 'left 0.5s linear';
        this.slider.style['-weblit-transition'] = 'left 0.5s linear';
        this.slider.style['-o-transition'] = 'left 0.5s linear';
        this.slider.style['-moz-transition'] = 'left 0.5s linear';
        this.slider.style['-ms-transition'] = 'left 0.5s linear';

        this.bgColor.style.width = '0.7rem';
        this.slider.style.left = '-0.04rem';
      }
      document.onmousemove = null;
      document.onmouseup = null;
      // 移除移动端事件
      document.ontouchmove = null;
      document.ontouchend = null;
    },
    // 四、定义一个获取鼠标当前需要移动多少距离的方法
    getOffsetX(offset, min, max) {
      let _offset = offset;
      if (offset < min) {
        _offset = min;
      } else if (offset > max) {
        _offset = max;
      }
      return _offset;
    },
    // 五、定义一个滑块解锁成功的方法
    success() {
      this.isSuccess = true;
      this.bgColor.style.width = '100%';
      this.isShow = true;
      setTimeout(() => {
        this.txt.innerHTML = '验证成功';
      }, 300);
      setTimeout(() => {
        this.slider.style.display = 'none';
        this.$emit('verification');
      }, 1500);

      // 滑动成功时，移除鼠标按下事件和鼠标移动事件
      this.slider.onmousedown = null;
      document.onmousemove = null;
      // 移除移动端事件
      document.ontouchstart = null;
      document.ontouchmove = null;
    }
  }
};
</script>

<style scoped lang="scss">
#box {
  position: relative;
  margin: 0.5rem 0 0.1rem;
  background-color: rgba(229, 229, 229, 1);
  width: 100%;
  height: 0.7rem;
  border-radius: 4px;
  box-shadow: 0px 8px 15px 0px rgba(15, 123, 247, 0.15);

  .el-icon-success {
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: 0.18rem;
    color: #57b21c;
    line-height: 0.7rem;

    &:before {
      font-size: 0.24rem;
      vertical-align: middle;
      margin-right: 0.1rem;
    }
  }
}

.bgColor {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 4px;
  background-color: #d1e9ff;
  transition: background 300ms cubic-bezier(0.42, 0, 0.35, 1.15);
}

.bgColorS {
  background-color: #f2fdeb;
}

.txt {
  position: absolute;
  width: 100%;
  height: 0.7rem;
  color: #333333;
  text-align: center;
  font-size: 0.18rem;
  line-height: 0.7rem;
}

.slider {
  position: absolute;
  left: -0.04rem;
  top: -0.04rem;
  width: 0.78rem;
  height: 0.78rem;
  border-radius: 4px;
  cursor: move;
  background-image: url('./move.png');
  background-size: 100%;
}

.slider-hide {
  animation: mymove 100ms 1 forwards;
}

@keyframes mymove {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}

.slider > i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.14rem;
}

.slider > .el-button--mini.is-circle {
  padding: 0.03rem;

  & > i {
    font-size: 0.14rem;
  }
}
</style>

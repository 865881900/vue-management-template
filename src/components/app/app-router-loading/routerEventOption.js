/**
 * @file: 控制Loading组件显示的控制器
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/4/14 5:49 PM
 */
import AppLoadingComponent from './index.vue';

export class ShowLoadingController {
  /**
   *
   * @param intervalTime 毫秒数, 规定毫秒内完成所有的请求, 则不用加载Loading组件
   * @param vm 绑定的Vue对象, 用来控制vm的showLoading组件;
   * @param routerQueue 当前请求的数组
   */
  constructor(Vue) {
    const that = this;
    // 间隔时间
    this.intervalTime = 0;
    // 是否禁止最小加载时间功能
    that.intervalForbid = false;
    // 时间戳
    this.time = 0;
    // 自增id
    this.index = 0;
    this.routerQueue = Vue.observable([]);
    this.vm = null;
    // 合并选项
    Vue.component(
      'AppRouterLoading',
      Vue.util.mergeOptions(AppLoadingComponent, {
        data: () => ({
          routerQueue: this.routerQueue,
          notShow: false
        }),
        watch: {
          $route: {
            handler: function (to) {
              this.toPath = to.path;
              that.emptyRouterQueue();
            },
            immediate: true
          }
        },
        beforeCreate() {
          that.vm = this;
        },
        created() {
          // 获取prop中intervalTime的值;
          that.intervalTime = this.intervalTime;
          // 判断是否禁用最小加载时间功能
          if ((that.intervalForbid = this.intervalTime < 100)) {
            this.notShow = true;
          }
        }
      })
    );
  }

  // 执行vm的notShow属相
  setVmShowLoading(notShow) {
    this.vm.notShow = notShow;
  }

  /**
   * 在请求队列中添加http的target,如果是该路由的第一个请求,记录时间戳
   * @return {number} 返回该请求的target
   */
  addRouterQueue() {
    // 获取该路由页面第一个请求的时间戳;
    if (this.routerQueue.length === 0 && !this.intervalForbid) {
      this.time = performance.now();
    }
    this.routerQueue.push(`${this.index}_${this.topPath}`);
    return this.index++;
  }

  /**
   * 当http请求完成后, 在队列中删除该请求,
   * 如果是该路由最后一个请求完成, 则判断是否小于最小加载时间;
   * 如果是,修改vm中showLoading为false
   * 否则,为true
   * @param tag 匹配http的标示
   */
  deleteRouterQueue(tag) {
    try {
      const { routerQueue } = this;
      for (let i = 0; i < routerQueue.length; i++) {
        if (routerQueue[i] === `${tag}_${this.topPath}`) {
          this.routerQueue.splice(i, 1);
          break;
        }
      }
      if (this.intervalForbid || !this.vm) {
        return;
      }
      if (routerQueue.length === 0 && performance.now() - this.time < this.intervalTime) {
        this.setVmShowLoading(false);
        return;
      }
      this.setVmShowLoading(true);
    } catch (err) {
      console.log('error:', err);
    }
  }

  /**
   * 跳转路由前,清空queue队列
   */
  emptyRouterQueue() {
    this.routerQueue.length = 0;
    if (this.intervalForbid || !this.vm) {
      return;
    }
    this.setVmShowLoading(false);
  }
}

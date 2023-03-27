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
    // 记录每个页面初始loading的时间
    this.newPageTime = 0;
    // 自增id
    this.index = 0;
		// 保存请求的队列
    this.routerQueue = Vue.observable([]);
		// 该功能对应的loading组件的实例
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
          '$route.path': {
            handler: function (to) {
							// 监听path变化后第一时间,后显示当前的loading
              that.setVmShowLoading(true);
							// 记录当前页面的path
							that.topPath = to.path;
							// 清除上一个页面的请求
							that.routerQueue.length = 0;
            },
            immediate: false
          }
        },
				// 渲染完毕后
				updated() {
					// 记录当前时间戳
					that.newPageTime =  Date.now();
				},
				beforeCreate() {
					that.vm = this;
				}
      })
    );
  }

  // 执行vm的notShow属相
  setVmShowLoading(notShow) {
		this.vm && (this.vm.notShow = notShow);
  }

  /**
   * 在请求队列中添加http的target,如果是该路由的第一个请求,记录时间戳
   * @return {number} 返回该请求的target
   */
  addRouterQueue() {
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
			if (routerQueue.length === 0) {
				// 如果一个页面请求玩所有的接口后,仍然小于1S,那么loading至少加载1s
				const newPageTime = this.newPageTime;
				const time = Date.now()
				if(time <  (newPageTime + 300)) {
					console.log('不足200毫秒');
					let id = setTimeout(() => {
						this.setVmShowLoading(false);
						clearTimeout(id);
					}, (newPageTime + 300) - time)
				} else {
					this.setVmShowLoading(false);
				}
      }
    } catch (err) {
      console.error('error:', err);
    }
  }
}

/**
 * @file: 根据用户权限, 动态加载不同的模块
 * @author: ChaoPengWang(wangcp-a@glodon.com)
 * @update: 2022/4/27 6:28 PM
 */
import routes from './routes';
import Vue from 'vue';

export class ControlDynamicRouter {
  // 左侧导航第一个path;
  defaultPath = '';

  // 权限模块的唯一标识字段名称
  idName = 'idName';

  // 匹配用户权限和本地路由配置模块的函数
  // eslint-disable-next-line no-empty-function
  getUserMenuPromiseFun = () => {};

  // 动态路由加载的回调函数
  // eslint-disable-next-line no-empty-function
  addRouteOption = null;

  // 路由对象
  router = null;

  // 权限过滤后的路由结构
  menuList = [];

  // 处理过的左侧导航数据
  dynamicRouterList = [];

  _pathMap = [];

  /**
   * @param options.idName 如果本地routes中配置和api返回权限中用模块的唯一ID; 用来匹配权限对应的模块
   * @param options.getUserMenuPromiseFun 获取用户角色权限信息的api封装,返回该用户的权限列表函数
   * @param options.addRouteOption 模块需要依赖的父组件,该组件必须有<router-view>标签
   * @param options.router 全局Router对象
   */
  constructor(options) {
    // 把绑menuList定到vue实例上
    const { idName, getUserMenuPromiseFun, addRouteOption, router } = options;
    if (!getUserMenuPromiseFun || !addRouteOption || !router) {
      throw new Error('参数不完整');
    }
    idName && (this.idName = idName);
    this.getUserMenuPromiseFun = getUserMenuPromiseFun;
    this.addRouteOption = addRouteOption;
    this._pathMap.push(this.addRouteOption.path);
    this.router = router;
    this._addRouterBeforeEach();
    this.collectPath(routes);
    Vue.util.defineReactive(this, 'menuList');
    Vue.prototype.$dynamicRouter = this;
  }

  // 添加路由全局前置守卫
  _addRouterBeforeEach() {
    this.router.beforeEach(async (to, from, next) => {
      try {
        console.log('to.path:', to.path);
        const { dynamicRouterList } = this;
        // 判断是否已经处理过路由
        if (dynamicRouterList.length > 0 || !this._pathMap.includes(to.path.toLowerCase())) {
          next();
          return;
        }
        const userMenu = await this.getUserMenuPromiseFun();
        if (userMenu.length === 0) {
          next();
          return;
        }
        await this.initMenuList(userMenu);
        next(to.path);
      } catch (e) {
        next();
        return Promise.reject(e);
      }
    });
  }

  // 收集配置中所有的当行路径
  collectPath(children) {
    let path;
    for (let i = 0; i < children.length; i++) {
      if (children[i].path) {
        path = (children[i].path || '').toLowerCase();
        this._pathMap.push(path);
      } else if (children[i].children && children[i].children.length > 0) {
        this.collectPath(children[i].children);
      }
    }
  }

  /**
   * 根据children解析当前用户的左侧导航数据;
   * @param children 用户的权限数组 {
   *  resCode:string,  //权限code
   *  children:Array   //子权限数组
   * }
   * @return {Error}
   */
  initMenuList(children) {
    try {
      this.emptyRouter();
      // 解析该权限对应的所有的前端路由
      this._banJurisdictionGetMenusList(children, this.menuList);
      if (this.menuList.length === 0) {
        return new Error('未匹配导航信息');
      }
      // 组装前端路由
      this._dynamicStateAddRouter(this.menuList, this.dynamicRouterList);
      // 返回第一个导航中第一个path
      this.defaultPath = this._setDefaultPath(this.dynamicRouterList);
      this.router.addRoute({
        ...this.addRouteOption,
        // 过滤掉,已经添加的模块
        children: this.dynamicRouterList.filter((item) => {
          const r = this.router.match(item.path);
          return r.name !== item.name;
        })
      });
    } catch (e) {
      console.log(e);
      throw new Error('解析路由失败');
    }
  }

  /**
   * 根据权限code, 返回路由配置对象; 如果没有匹配到,则返回false;
   * @param userItem 角色权限对象
   * @return {boolean|*} 路由对象
   */
  _getMenusEntityByCode(userItem) {
    for (let i = 0; i < routes.length; i++) {
      const configItem = routes[i];
      if (userItem[this.idName] === configItem[this.idName]) {
        return configItem;
      }
    }
    return false;
  }

  /**
   * 遍历用户权限数组, 从动态路由配置中匹配权限对应的模块;
   * @param children 用户的权限数组
   * @param arr 收集本地组件的数组
   * @private
   */
  _banJurisdictionGetMenusList(children = [], arr) {
    let menu, userItem;
    for (let i = 0; i < children.length; i++) {
      userItem = children[i];
      if ((menu = this._getMenusEntityByCode(userItem))) {
        arr.push(Object.assign(userItem, menu));
        if (userItem.children && userItem.children.length > 0) {
          menu.children = [];
          this._banJurisdictionGetMenusList(userItem.children, menu.children);
        }
      }
    }
  }

  // 解析动态路由信息,整理出该用户所需的动态路由的 路由信息
  _dynamicStateAddRouter(menu, dynamicRouterList) {
    menu.forEach((item) => {
      if (item.path) {
        dynamicRouterList.push({
          title: item.title,
          name: item.name,
          path: item.path,
          component: item.component
        });
      }
      if (item.children) {
        this._dynamicStateAddRouter(item.children, dynamicRouterList);
      }
    });
  }

  // 获取default的path值
  _setDefaultPath(dynamicRouterList) {
    for (let i = 0; i < dynamicRouterList.length; i += 1) {
      const item = dynamicRouterList[i];
      if (item.path) {
        return item.path;
      } else if (item.children) {
        return this._setDefaultPath(item.children);
      }
    }
  }

  // 清除路由信息
  emptyRouter() {
    this.menuList.length = this.dynamicRouterList.length = 0;
  }

  // 切换路由渲染的组件
  reloadDynamicRouter(options) {
    const { idName, getUserMenuPromiseFun, addRouteOption } = options;
    idName && (this.idName = idName);
    getUserMenuPromiseFun && (this.getUserMenuPromiseFun = getUserMenuPromiseFun);
    addRouteOption && (this.addRouteOption = addRouteOption);
    this._addRouterBeforeEach();
  }
}

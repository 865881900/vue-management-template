/**
 * 动态导航/路由 配置
 *
 * 注意: 配置分为三种
 *------------------------------------------------------------------------
 * 1:以下格式为目录菜单, 点击后展开子菜单,没有对应页面;
 *  {
 *    name: '企业查询',
 *    resCode: 'GG-QYCX',
 *  },
 *------------------------------------------------------------------------------
 * 2:单一模块, 点击对应导航后,跳转到指定页面, 所有和该模块有关系的业务都在该模块中完成
 *   {
 *     name: 'a',
 *     title: 'A模块',
 *     resCode: 'GZ_GFM_ENTERPRISE_LIST',
 *     path: '/a',
 *     component: () => import('@/views/a'),
 *   },
 *------------------------------------------------------------------------------
 * 3:多页面模块,点击对应导航后, 跳转到该模块的主页面, 他children中的路由, 也对应到该模块的导航上
 *  ******  注意 ******
 *  ******  注意 ******
 *  ******  注意 ******
 *  必须配置属性:  isChildNav:true
 *   {
 *     name: 'a',
 *     title: 'A模块',
 *     resCode: 'GZ_GFM_ENTERPRISE_LIST',
 *     path: '/a',
 *     component: () => import('@/views/a'),
 *     isChildNav: true, // 有该属性, 代表为模块的根组件
 *     children: [{   //他的children中的页面不能在左侧导航切换,  children 表示A模块中依赖的页面, 跳转到该页面后, 左侧导航不会发生变化
 *       name: 'a1',
 *       title: 'A1页面',
 *       path: '/a1',
 *       component: () => import('@/views/a/a1'),
 *     }]
 *   },
 *------------------------------------------------------------------------
 */
export default [
  {
    resCode: 'GDW_WITNESS_PERFERENCE',
    title: '目录菜单'
  },
  {
    name: 'ComponentA',
    resCode: 'WitnessTask/Witnessing',
    component: () => import('@/views/componentA'),
    path: '/A',
    icon: ''
  },
  {
    name: 'ComponentB',
    resCode: 'Workbench',
    path: '/B',
    component: () => import('@/views/componentB')
  }
];

module.exports =  {
  env: {
    /** axios 配置 */
    VUE_APP_API_URL: '/expertfee/',// 本地环境链接服务器的的url前缀
    VUE_APP_API_TIMEOUT: -1, //axios请求的最大延迟数
    VUE_APP_API_PORT: '9999', // 本地启动端口
    VUE_APP_API_TARGET: 'http://10.0.168.114:8888',// 本地环境服务地址
    /** 打包配置 */
    VUE_APP_PUBLIC_PATH: '/', // webpack的publicPath
    VUE_APP_EXPLAIN: '基础配置', // 配置的名称
    VUE_APP_TITLE: '模板1', // html的title
    /** 系统配置 */
    SYSTEM_CODE: 'G3_EXPERTFEE' // 本系统代码
  },
  development: {
    EXPLAIN: '本地环境'
  },
  production: {
    EXPLAIN: '生产环境',
    VUE_APP_PUBLIC_PATH: './'
  },
  'production-dev': {
    EXPLAIN: '测试环境'
  },
  'production-speed': {
    TEST_SPEED: 'true', // 带包速度的测试
    EXPLAIN: '查看打包速度'
  }
};

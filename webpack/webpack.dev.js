/**
 * 本地环境webpack配置
 */

const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base');
const webpackDev = {
  devServer: {
    host: '0.0.0.0',
    port: 8090, // 端口号
    https: false, // https:{type:Boolean}
    open: {
      target: 'http://localhost:8090/'
    } // 配置自动启动浏览器
  },
  devtool: 'cheap-source-map',
  mode: 'development'
};
module.exports = merge(webpackDev, webpackBase);

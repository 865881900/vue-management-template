/**
 * 测试环境打包配置
 */
const { merge } = require('webpack-merge');
const webpackProd = require('./webpack.prod');
const webpackProdDev = {
  devtool: 'cheap-source-map'
};
module.exports = merge(webpackProdDev, webpackProd);

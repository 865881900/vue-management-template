/**
 * 测试环境打包配置
 */
const webpackProd = require('./webpack.prod');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

module.exports = merge(
  {
    devtool: 'source-map',
    plugins: [
      // webpack体积分析
      new BundleAnalyzerPlugin()
    ]
  },
  webpackProd
);

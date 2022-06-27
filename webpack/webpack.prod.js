/**
 * 正式环境打包配置
 */
const webpackBase = require('./webpack.base');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackProd = {
  optimization: {
    minimize: true,
    minimizer: [
      // webpack5.0 使用css-minimizer-webpack-plugin  替换 html-webpack-externals-plugin,css压缩
      new CssMinimizerPlugin(),
      // js压缩
      new TerserPlugin()
    ]
  },
  mode: 'production'
};
module.exports = merge(webpackProd, webpackBase);

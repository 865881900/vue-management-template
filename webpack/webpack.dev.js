/**
 * 本地环境webpack配置
 */
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackDev = {
  devServer: {
    host: '0.0.0.0',
    port: 8090, // 端口号
    https: false, // https:{type:Boolean}
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:3000',
        pathRewrite: {
          '/api': '/'
        }
      }
    }
    // open: {
    //   target: 'http://localhost:8090/'
    // }  配置自动启动浏览器
  },
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name][contenthash:8].css'
    }),
    new VueLoaderPlugin()
  ]
};
module.exports = merge(webpackDev, webpackBase);

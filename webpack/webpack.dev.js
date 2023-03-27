/**
 * 本地环境webpack配置
 */
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfig = require('./webpackConfig');
const webpackDev = {
  devServer: {
    host: '0.0.0.0',
    port: webpackConfig.VUE_APP_API_PORT || '8080', // 端口号
    https: false, // https:{type:Boolean}
    proxy: {
      '/expertfee': {
        changeOrigin: true,
        target: webpackConfig.VUE_APP_API_TARGET,
        pathRewrite: {
          '/expertfee': '/expertfee'
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

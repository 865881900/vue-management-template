/**
 * 自定义分包del配置
 */
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: {
    vue: ['vue', 'vuex', 'vue-router'],
    element: ['element-gui']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve('./build/library'),
    library: '[name]_[fullhash]'
  },
  plugins: [
    // dist文件目录清理
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      name: '[name]_[fullhash]'
    })
  ],
  mode: 'production'
};

/**
 * webpack打包基础配置
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// const PostcssPresetEnv = require('postcss-preset-env');
// 多线程构建,预热
// const threadLoader = require('thread-loader');
// threadLoader.warmup({}, ['babel-loader']);
console.log(`\x1b[91m${`当前启动模式为:${process.env.MODEL}`}\x1b[0m`);
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: process.env.VUE_APP_publicPath
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        use: ['thread-loader', 'babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader', // 压缩图片为base64格式
            options: {
              limit: 1024 * 100,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'image/[folder]/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|)$/i,
        type: 'asset'
      },
      {
        test: /\.vue$/i,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    require('postcss-preset-env'),
    // dist文件目录清理
    new CleanWebpackPlugin(),
    // 优化命令行
    new FriendlyErrorsWebpackPlugin(),
    // 建立dll映射
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/element-manifest.json')
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/vue-manifest.json')
    }),
    // html
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    // 引入dll文件
    new AddAssetHtmlPlugin({
      glob: path.resolve(__dirname, '../build/library/*.dll.js'),
      outputPath: '/dll',
      publicPath: `${process.env.VUE_APP_publicPath}dll`
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve('src'),
      api: path.resolve('http/api')
    }
  },
  stats: 'errors-only'
};

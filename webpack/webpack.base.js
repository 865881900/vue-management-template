/**
 * webpack打包基础配置
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const webpack = require('webpack');

const webpackConfig = require('./webpackConfig');

console.log(`\x1b[91m${`执行配置:${webpackConfig.EXPLAIN}`}\x1b[0m`);
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: webpackConfig.VUE_APP_PUBLIC_PATH,
    filename: 'js/[name].js',
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              exclude: /node_modules/,
              cacheDirectory: true // 开启缓存
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader'
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 10
          }
        }
        // use: [
        //   {
        //     loader: 'url-loader', // 压缩图片为base64格式
        //     options: {
        //       limit: 1024 * 100,
        //       fallback: {
        //         loader: 'file-loader',
        //         options: {
        //           name: 'image/[folder]/[name].[hash:8].[ext]'
        //         }
        //       }
        //     }
        //   }
        // ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|)$/i,
        type: 'asset'
      },
      {
        test: /\.vue$/i,
        use: {
          loader: 'vue-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ENV_NODE': JSON.stringify(process.env.ENV_NODE)
    }),
    // dist文件目录清理
    new CleanWebpackPlugin(),
    // 优化命令行
    new FriendlyErrorsWebpackPlugin(),
    // html
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: path.resolve('./node_modules/vue/dist/vue.common.prod.js'),
      '@': path.resolve('src'),
      api: path.resolve('src/http/api/index.js')
    },
    modules: [path.resolve('node_modules')],
    exportsFields: [],
    mainFields: ['main']
  },
  performance: {
    hints: false
    // maxAssetSize: 512000
  },
  stats: 'errors-only'
};

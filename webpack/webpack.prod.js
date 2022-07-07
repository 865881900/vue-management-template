/**
 * 正式环境打包配置
 */
const webpackBase = require('./webpack.base');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpackConfig = require('./webpackConfig.js');
const path = require('path');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const webpackProd = {
  cache: true,
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          minChunks: 2,
          test: /\.js$/,
          name: 'commons',
          chunks: 'all'
        },
        styles: {
          minChunks: 2,
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      // webpack5.0 使用css-minimizer-webpack-plugin  替换 html-webpack-externals-plugin,css压缩
      new CssMinimizerPlugin(),
      // js并行压缩压缩优化webpack 使用TerserWebpackPlugin 替换 UglifyjsWebpackPlugin; TerserPlugin 没有优化,不推荐
      new TerserWebpackPlugin({
        extractComments: false
        // cache: true, 5.0移除该选择项, 继承为webpack的cache选项
        // parallel: false
      })
    ]
  },
  mode: 'production',
  plugins: [
    // 建立dll映射
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../build/element-manifest.json')
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../build/vue-manifest.json')
    }),
    // 引入dll文件
    new AddAssetHtmlPlugin({
      glob: path.resolve(__dirname, '../build/library/*.dll.js'),
      outputPath: '/dll',
      publicPath: `${webpackConfig.VUE_APP_PUBLIC_PATH}dll`
    })
    // new PurgeCSSPlugin({
  ]
};
// 打包速度分析, 使用分析会和AddAssetHtmlPlugin插件有冲突
if (webpackConfig.TEST_SPEED === 'true') {
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(merge(webpackProd, webpackBase));
  configWithTimeMeasures.plugins.push(
    // css文件单独提取
    new MiniCssExtractPlugin({
      filename: 'css/[name][contenthash:8].css'
    }),
    new VueLoaderPlugin()
  );
  module.exports = configWithTimeMeasures;
} else {
  // 没有速度检测的执行
  module.exports = merge(webpackProd, webpackBase, {
    plugins: [
      // css文件单独提取
      new MiniCssExtractPlugin({
        filename: 'css/[name][contenthash:8].css'
      }),
      new VueLoaderPlugin()
    ]
  });
}

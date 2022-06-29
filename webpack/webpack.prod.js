/**
 * 正式环境打包配置
 */
const webpackBase = require('./webpack.base');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpackProd = {
  optimization: {
    splitChunks: {
      minSize: 1024 * 100,
      cacheGroups: {
        commons: {
          minChunks: 2,
          // test: /(react|reack-dom)/,
          name: 'commons',
          chunks: 'all'
        }
      }
    },
    minimize: true,
    minimizer: [
      // webpack5.0 使用css-minimizer-webpack-plugin  替换 html-webpack-externals-plugin,css压缩
      new CssMinimizerPlugin(),
      // js压缩优化webpack 使用TerserWebpackPlugin 替换 UglifyjsWebpackPlugin; TerserPlugin 没有优化,不推荐
      new TerserWebpackPlugin()
    ]
  },
  mode: 'production'
};
// 打包速度分析
const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(merge(webpackBase, webpackProd));
// https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
configWithTimeMeasures.plugins.unshift(
  new MiniCssExtractPlugin({
    filename: '[name][contenthash:8].css'
  }),
  new VueLoaderPlugin()
);
// 体积分析
module.exports = configWithTimeMeasures;

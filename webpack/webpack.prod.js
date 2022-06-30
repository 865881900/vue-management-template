/**
 * 正式环境打包配置
 */
const webpackBase = require('./webpack.base');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpackProd = {
  optimization: {
    splitChunks: {
      minSize: 1024 * 200,
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
      // js并行压缩压缩优化webpack 使用TerserWebpackPlugin 替换 UglifyjsWebpackPlugin; TerserPlugin 没有优化,不推荐
      new TerserWebpackPlugin({
        // parallel: false
      })
    ]
  },
  mode: 'production'
};

// 打包速度分析, 使用分析会和AddAssetHtmlPlugin插件有冲突
if (process.env.TEST_SPEED === 'true') {
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(merge(webpackProd, webpackBase));
  configWithTimeMeasures.plugins.push(
    // css文件单独提取
    new MiniCssExtractPlugin({
      filename: '[name][contenthash:8].css'
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
        filename: '[name][contenthash:8].css'
      }),
      new VueLoaderPlugin()
    ]
  });
}

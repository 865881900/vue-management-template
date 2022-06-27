module.exports = {
  // 在这里添加postcss配置
  // Learn more about it at https://github.com/webpack-contrib/postcss-loader#config-files
  plugins: () => [
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 version', '>1%', 'IE 10']
    })
  ]
};

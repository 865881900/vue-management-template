#项目命令

###1: 本地
```
npm run dev
// or
npm run serve
```

###2: 测试环境打包
```
npm run build:dev
```

###3: 正式环境打包
```
npm run build
```


# 说明
> 该项目为gld-cli脚手架vue2.0的模板项目

#目录说明

```
VueManagementTemplate
├─src
├─.browserslistrc 分享目标浏览器和nodejs版本在不同的前端工具。这些工具能根据目标浏览器自动来进行配置，git地址: https://github.com/browserslist/browserslist
├─.commitlintrc.js  git提交规范 commitLint; git地址: https://github.com/conventional-changelog/commitlint
├─.editorconfig 帮助开发人员在不同的编辑器和IDE之间定义和维护一致的编码样式; 官网: https://editorconfig.org/
├─.eslintignore ESlint检查忽略的文件配置
├─.eslintrc.js  ESlint 格式规则; git地址: https://github.com/eslint/eslint
├─.prettierignore prettier忽略的文件配置
├─.prettierrc.js prettier 格式规则;  git地址: https://github.com/prettier/prettier
├─.stylelintignore stylelint忽略的文件配置
├─.stylelintrc.js stylelint 格式规则; get地址: https://github.com/stylelint/stylelint
├─README.md 项目说明
├─babel.webpackConfig.js babel配置
├─package.json
├─webpack
|    ├─webpack.base.js webpack基础配置
|    ├─webpack.dev.js  本地环境配置
|    ├─webpack.prod.dev.js 测试环境配置
|    └webpack.prod.js 生产环境配置
├─src
|  ├─App.vue
|  ├─a.js
|  └main.js
└result.txt 使用treer生成目录结构文件存储, 使用treer, 需要安装 sudo npm i treer -g
```


# 使用常见问题:

#### 1: commit规则不生效
> 按照一下步骤执行一遍

```shell
npm run install:husky
```
```shell
cat <<EEE > .husky/commit-msg
#!/bin/sh
. "\$(dirname "\$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
EEE
```
```sh
chmod a+x .husky/commit-msg
```

> 执行该命令进行测试

```shell
npx commitlint --from HEAD~1 --to HEAD --verbose
```

#### 2: Cannot spawn .husky/pre-commit: No such file or directory
> 检查.husky/pre-commit文件的换行标识符，将CRLF换成LF。即可顺利解决该问题。

#### 3: hint: The ‘.husky/pre-commit‘ hook was ignored because it‘s not set as executable.
> husky 的 hook 在 mac 上不生效的问题, 执行下面的命令
```shell
chmod 777 .husky/*
```

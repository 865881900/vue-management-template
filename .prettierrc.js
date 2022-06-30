module.exports = {
  printWidth: 120, // 超过最大值换行
  tabWidth: 2, // 缩进字节数
  useTabs: false, // 缩进不使用tab，使用空格
  semi: true, // 句尾添加分号
  vueIndentScriptAndStyle: false, // 建议关闭, 很恶心的规则;  如果开启,那么在vue的script和style标签中,顶级开启缩进
  singleQuote: true, // 使用单引号代替双引号
  quoteProps: 'as-needed',
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  trailingComma: 'none', // <es5|none|all>在对象或数组最后一个元素后面是否加逗号
  jsxBracketSameLine: false, // 在jsx中'>'不单独放一行
  jsxSingleQuote: true, // jsx使用单引号代替双引号
  arrowParens: 'always', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto', // 结尾是 \n \r \n\r auto
  rangeStart: 0
};

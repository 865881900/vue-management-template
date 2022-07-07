// https://eslint.org/docs/user-guide/configuring
const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier', 'plugin:prettier/recommended'],
  plugins: [],
  globals: {
    module: true,
    require: true,
    process: true,
    _: true
  },
  // .vue文件中覆盖indent
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 0,
        'no-empty-function': 0
      }
    }
  ],
  // add your custom rules here
  rules: {
    // watch中不能使用箭头函数, eslint7+
    // 'vue/no-arrow-functions-in-watch': 2,
    // 该规则禁止在相同的 v-if/v-else-if链中使用重复条件, eslint7+
    // 'vue/no-dupe-v-else-if': 2,
    // 组件属性不能突变, eslint7+
    // 'vue/no-mutating-props': 2,
    // computed不能异步
    'vue/no-async-in-computed-properties': 2,
    // 禁止使用重复的属性名称
    'vue/no-dupe-keys': 2,
    // 除了class style外禁止重复属性
    'vue/no-duplicate-attributes': 2,
    // 不容许覆盖保留键
    'vue/no-reserved-keys': 2,
    // 将组件的数据属性强制为函数
    'vue/no-shared-component-data': 2,
    // 防止代码在计算属性和函数中产生副作用
    'vue/no-side-effects-in-computed-properties': 2,
    // 禁止在textarea中使用插值
    'vue/no-textarea-mustache': 2,
    // 不容许在模板中使用未注册的组件
    'vue/no-unused-components': 2,
    // 禁止使用v-for的未使用变量定义
    'vue/no-unused-vars': 2,
    // 防止在同一元素上同时使用 v-for 指令和 v-if 指令
    'vue/no-use-v-if-with-v-for': 2,
    // 动态组件必须有动态的is属性
    'vue/require-component-is': 2,
    // prop类型必须是构造函数myProp: Number
    'vue/require-prop-type-constructor': 2,
    // render函数必须有返回值
    'vue/require-render-return': 2,
    // v-for中必须有key且最好不要用index
    'vue/require-v-for-key': 1,
    // props默认值必须为有效值
    'vue/require-valid-default-prop': 2,
    // computed必须有返回值
    'vue/return-in-computed-property': 2,
    // v-if必须有效
    'vue/valid-v-if': 2,
    // v-else-if必须有效
    'vue/valid-v-else-if': 2,
    // v-else必须有效
    'vue/valid-v-else': 2,
    // v-for必须有效
    'vue/valid-v-for': 2,
    // v-model必须有效
    'vue/valid-v-model': 2,
    // v-slot必须有效
    'vue/valid-v-slot': 2,
    // 自定义组件上使用带连字符的属性名<MyComponent my-prop="prop" />
    'vue/attribute-hyphenation': 1,
    // 自定义组件使用驼峰命名
    'vue/component-definition-name-casing': 1,
    // html中>换行，属性换行>换行，属性不换行>不换行，
    'vue/html-closing-bracket-newline': [
      2,
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],
    // .vue中html缩进
    'vue/html-indent': [
      2,
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
        ignores: ['VAttribute']
      }
    ],
    // .vue中html使用双引号
    'vue/html-quotes': [2, 'double'],
    // html标签要求闭合，组件标签没有插槽同html单标签，有插槽同html双标签
    'vue/html-self-closing': [
      0,
      {
        html: {
          normal: 'never',
          void: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    // 达式和大括号之间需要一个空格
    'vue/mustache-interpolation-spacing': 2,
    // 禁止属性间多个空格
    'vue/no-multi-spaces': 2,
    // 禁止属性间多个空格
    'vue/no-spaces-around-equal-signs-in-attribute': 2,
    // 不能有v-for的隐藏变量声明
    'vue/no-template-shadow': 2,
    // 组件的props中属性强制驼峰命名
    'vue/prop-name-casing': 2,
    // .vue中script缩进
    'vue/script-indent': [
      2,
      2,
      {
        baseIndent: 0,
        switchCase: 1,
        ignores: []
      }
    ],
    // Possible Errors
    'no-alert': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁止使用alert confirm prompt
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁止使用console
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁止使用debugger
    'no-await-in-loop': 2, // 禁止在循环中出现await
    'no-extra-parens': 0, // 禁止不必要的括号
    'no-template-curly-in-string': 2, // 禁止在常规字符串中出现模板字面量占位符语法
    'block-scoped-var': 2, // 强制把变量的使用限制在其定义的作用域范围内
    complexity: [1, 15], // 指定程序中允许的最大环路复杂度
    // Best Practices
    curly: [2, 'all'], // 强制所有控制语句使用一致的括号风格 if(){} 中的{}
    eqeqeq: 1, // 必须使用全等
    'no-div-regex': 2, // 禁止除法操作符显式的出现在正则表达式开始的位置/=foo/
    'no-else-return': 2, // 如果if语句里面有return,后面不能跟else语句
    'no-empty-function': 2, // 禁止出现空函数
    'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
    'no-fallthrough': 2, // 禁止 case 语句落空
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
    'no-invalid-this': 2, // 禁止 this 关键字出现在类和类对象之外
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-loop-func': 2, // 禁止在循环语句中出现包含不安全引用的函数声明
    'no-multi-spaces': 2, // 禁止使用多个空格
    'no-multi-str': 2, // 禁止使用多行字符串
    'no-new-func': 0, // 禁止对 Function 对象使用 new 操作符
    'no-new-wrappers': 2, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-param-reassign': 2, // 禁止对 function 的参数进行重新赋值
    'no-return-assign': 2, // 禁止在 return 语句中使用赋值语句
    'no-return-await': 2, // 禁用不必要的 return await
    'no-self-compare': 2, // 禁止自身比较
    'no-sequences': 2, // 禁用逗号操作符
    'no-throw-literal': 2, // 禁止抛出异常字面量
    'no-unmodified-loop-condition': 2, // 禁用一成不变的循环条件
    'no-useless-call': 2, // 禁止不必要的 .call() 和 .apply()
    'no-useless-concat': 2, // 禁止不必要的字符串字面量或模板字面量的连接
    'no-useless-return': 2, // 禁止多余的 return 语句
    'require-await': 1, // 禁止使用不带 await 表达式的 async 函数
    'vars-on-top': 2, // 要求所有的 var 声明出现在它们所在的作用域顶部
    yoda: [2, 'never'], // 禁止尤达条件
    // Variables
    'init-declarations': [0, 'always'], // 声明时必须赋初值
    'no-shadow': 1, // 禁止变量声明与外层作用域的变量同名
    'no-undef-init': 2, // 禁止将变量初始化为 undefined
    'no-undefined': 2, // 禁止将 undefined 作为标识符
    'no-use-before-define': 2, // 禁止在变量定义之前使用它们
    'no-unused-vars': 2, // 禁止使用未使用变量定义
    // Stylistic Issues
    'array-bracket-spacing': [2, 'never'], // 强制数组方括号中使用一致的空格
    'block-spacing': [2, 'always'], // 禁止或强制在代码块中开括号前和闭括号后有空格
    'brace-style': [2, '1tbs'], // 强制在代码块中使用一致的大括号风格
    camelcase: 2, // 强制驼峰法命名
    'comma-dangle': [2, 'never'], // 禁止末尾逗号
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ], // 强制在逗号前后使用一致的空格
    'comma-style': [2, 'last'], // 强制使用一致的逗号风格
    'computed-property-spacing': [2, 'never'], // 强制在计算的属性的方括号中使用一致的空格
    'consistent-this': [2, 'that'], // this别名
    'eol-last': [2, 'always'], // 要求文件末尾保留一行空行
    'func-call-spacing': [2, 'never'], // 禁止在函数名和开括号之间有空格
    'func-name-matching': [2, 'always'], // 要求函数名与赋值给它们的变量名或属性名相匹配
    indent: [2, 2, { SwitchCase: 1 }], // 缩进风格
    'jsx-quotes': [2, 'prefer-single'], // 强制所有不包含双引号的 JSX 属性值使用双引号。
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ], // 对象字面量中冒号的前后空格
    'keyword-spacing': 2, // 要求在关键字前后至少有一个空格
    // 'linebreak-style': [2, 'windows'], // 强制使用 Windows 换行符
    'lines-between-class-members': [2, 'always'], // 要求在类成员之后有一行空行
    'max-depth': [1, 5], // 强制块语句的最大可嵌套深度
    // 'max-len': [2, { code: 120 }], // 强制行的最大长度
    'max-lines': [2, 1000], // 强制一个文件的最大行数
    'max-lines-per-function': [1, 100], // 强制在函数中的最大行数
    'max-nested-callbacks': [2, 5], // 强制回调函数最大可嵌套深度
    'max-params': [2, 5], // 强制函数定义中最大参数个数
    'max-statements-per-line': 2, // 强制每一行中所允许的最大语句数量。
    'new-cap': 1, // 要求构造函数首字母大写
    'no-lonely-if': 1, // 如果 if 语句作为唯一的语句出现在 else 语句块中，往往使用 else if 形式会使代码更清晰。
    'no-multi-assign': 0, // 禁止连续赋值
    'no-multiple-empty-lines': [0, { max: 0 }], // 空行最多不能超过2行
    'no-trailing-spaces': 0, // 一行结束后面不要有空格
    'no-unneeded-ternary': 2, // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'no-whitespace-before-property': 2, // 禁止属性前有空白
    'object-curly-newline': 2, // 强制大括号内换行符的一致性
    'object-curly-spacing': [2, 'always'], // 强制在大括号中使用一致的空格
    'one-var': 0, // 强制函数中的变量要么一起声明要么分开声明
    'operator-linebreak': 2, // 强制操作符使用一致的换行符
    quotes: [2, 'single'], // 引号类型 `` "" ''
    semi: [2, 'always'], // 语句强制分号结尾
    'semi-spacing': 2, // 强制分号之前和之后使用一致的空格
    'space-before-blocks': 2, // 强制在块之前使用一致的空格
    'space-in-parens': 2, // 强制在圆括号内使用一致的空格
    'space-infix-ops': 2, // 要求操作符周围有空格
    'space-unary-ops': 2, // 强制在一元操作符前后使用一致的空格
    'spaced-comment': 1, // 强制在注释中 // 或 /* 使用一致的空格
    'switch-colon-spacing': 2, // 强制在 switch 的冒号左右有空格
    'template-tag-spacing': 2, // 要求或禁止在模板标记和它们的字面量之间有空格
    // ECMAScript 6
    'arrow-body-style': 2, // 要求箭头函数体使用大括号
    'arrow-spacing': 2, // 强制箭头函数的箭头前后使用一致的空格
    'no-duplicate-imports': 2, // 禁止重复模块导入
    'no-useless-computed-key': 2, // 禁止在对象中使用不必要的计算属性
    'no-useless-rename': 2, // 禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
    'no-var': 1, // 要求使用 let 或 const 而不是 var
    'prefer-arrow-callback': 1, // 要求回调函数使用箭头函数
    'prefer-const': 1, // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-destructuring': 1, // 优先使用数组和对象解构
    'prefer-template': 1, // 要求使用模板字面量而非字符串连接
    'rest-spread-spacing': 2, // 强制剩余和扩展运算符及其表达式之间有空格
    'symbol-description': 2, // 要求 symbol 描述
    'template-curly-spacing': 2, // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    'yield-star-spacing': 2, // 强制在 yield* 表达式中 * 周围使用空格
    'no-prototype-builtins': 1 // 禁止直接使用 Object.prototypes 的内置属性
  }
});

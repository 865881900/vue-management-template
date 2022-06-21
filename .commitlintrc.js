module.exports = {
    ignores: [(commit) => commit.includes('init')],
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-empty': [2, 'never'], // subjec不t为空
        'type-empty': [2, 'never'], // type不为空
        'type-enum': [
            2,
            'always',
            [
                'feat', // 新特性、新功能
                'fix', // 修改bug
                'perf', // 优化相关，比如提升性能、体验
                'revert', // 回滚到上一个版本
                'docs', // 文档修改
                'style', // 代码格式修改, 注意不是 css 修改
                'refactor', // 代码重构
                'test', // 测试用例修改
                'build', // 项目构建
                'ci', // 持续集成
                'chore' // 改变构建流程、或者增加依赖库、工具等（conventionalCommitsAngular外）
            ]
        ],
        'scope-case': [2, 'always', 'lowerCase']
    }
};

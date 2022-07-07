module.exports = {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
    '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
    'package.json': ['prettier --write'],
    '*.vue': ['eslint --fix', 'prettier --write', 'stylelint --fix'],
    '*.{scss,less,styl}': ['stylelint --fix --custom-syntax postcss-scss', 'prettier --write'],
    '*.md': ['prettier --write']
};

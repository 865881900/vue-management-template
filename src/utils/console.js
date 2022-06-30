/**
 *
 * @param message 打印内容
 * @param color 打印颜色
 *  基本7色 30 ~ 36
 *  基本高对比色 90 ~ 96
 * @return {string}
 */
function changeColor(message, color = 92) {
  console.log(`\x1b[${color}m${message}\x1b[0m`);
}

function error(message) {
  changeColor(message, 91);
}

function success(message) {
  changeColor(message, 92);
}

function warning(message) {
  changeColor(message, 93);
}

export default {
  error,
  success,
  warning
};

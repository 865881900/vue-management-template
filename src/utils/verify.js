import { isString } from 'loadsh/lang';
import ValidError from './error/ValidError';

export function isPhone(phone) {
  if (!isString(phone)) {
    throw new ValidError('请输入正确的手机号');
  }
  if (phone === '') {
    throw new ValidError('手机号不能为空');
  }
  if (!/^1\d{10}$/.test(phone)) {
    throw new ValidError('请输入正确的手机号');
  }
}
export function validateFun(v = {}, validateMap = {}) {
  const keys = Object.keys(validateMap);
  keys.forEach((key) => {
    if (v[key] === '' || v[key] === void 0) {
      throw new ValidError(`${validateMap[key]}不能为空`);
    }
  });
}

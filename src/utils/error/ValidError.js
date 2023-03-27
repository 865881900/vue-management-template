// 核验异常;
export default class ValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidError';
  }
}

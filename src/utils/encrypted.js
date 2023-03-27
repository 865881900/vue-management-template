import { JSEncrypt } from '../../public/jsencrypt/jsencrypt.min.js';
// 加密
export default function encryptedData(publicKey, data) {
  // 新建JSEncrypt对象
  let encryptor = new JSEncrypt();
  // 设置公钥
  encryptor.setPublicKey(publicKey);
  // 加密数据
  return encryptor.encrypt(data);
}

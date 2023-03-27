import { env as webpackConfig } from '../../.env-cmdrc';
import { IEVersion } from './index';

function downloadBlob(content, filename) {
  window.URL = window.URL || window.webkitURL;
  let a = document.createElement('a');
  let blob = new Blob([content]);
  // 通过二进制文件创建url
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  // 销毁创建的url
  window.URL.revokeObjectURL(url);
}

function fileAjax(url, callback, options) {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  if (options.responseType) {
    xhr.responseType = options.responseType;
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr);
    }
  };
  xhr.send();
}

export function downloadFile(filePath) {
  let url = `${webpackConfig.VUE_APP_PUBLIC_PATH}${filePath}`;
  if (IEVersion() === -1) {
    // 发送http请求，将文件链接转换成文件流
    fileAjax(
      url,
      (xhr) => {
        downloadBlob(xhr.response, 'CA锁驱动.zip');
      },
      {
        responseType: 'blob'
      }
    );
  } else {
    window.open(url, '_blank');
  }
}

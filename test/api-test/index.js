// 测试封装的axios
import assert from 'assert';
import { axios } from '../../apis';
import { Axios } from '../../apis/Axios.js';
import getTag from 'loadsh/_getTag.js';

describe('test apis module', () => {
  const url = 'http://localhost:3000/';
  it('test axios GET method ', async () => {
    let data = await axios.get(`${url}test/get`);
    assert.equal(data.code, 200);
    data = await axios.request(`${url}test/get`);
    assert.equal(data.code, 200);
  });
  it('test axios HEAD method ', async () => {
    await axios.head(`${url}test/head`);
    await axios.request(`${url}test/head`, {}, 'HEAD');
  });
  it('test axios DELETE method ', async () => {
    let data = await axios.delete(`${url}test/delete`);
    assert.equal(data.code, 200);
    data = await axios.request(`${url}test/delete`, {}, 'delete');
    assert.equal(data.code, 200);
  });
  it('test axios POST method ', async () => {
    let data = await axios.post(`${url}test/post`);
    assert.equal(data.code, 200);
    data = await axios.request(`${url}test/post`, {}, 'post');
    assert.equal(data.code, 200);
  });
  it('test axios PUT method ', async () => {
    let data = await axios.put(`${url}test/put`);
    assert.equal(data.code, 200);
    data = await axios.request(`${url}test/put`, {}, 'put');
    assert.equal(data.code, 200);
  });
  it('test axios PATCH method ', async () => {
    let data = await axios.patch(`${url}test/patch`, {}, {});
    assert.equal(data.code, 200);
    data = await axios.request(`${url}test/patch`, {}, 'patch', {});
    assert.equal(data.code, 200);
  });
});
describe('test Axios object', () => {
  const axios = new Axios();
  it('test axios._jointAjaxData method', function () {
    const data = {
      a: 12
    };
    const url = axios._jointAjaxData(data);
    assert(url, '?a=12&');
    console.log(getTag({}));
  });
});

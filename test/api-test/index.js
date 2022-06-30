// 测试封装的axios
import assert from 'assert';
import { axios } from '../../src/http/index.js';
import getTag from 'loadsh/_getTag.js';

const url = 'http://localhost:3000/';
// 需要启动 ./serve.js
// 执行该测试用例需要在package.json 中配置  "type":"module"
describe('test apis module', () => {
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
  it('test axios._jointAjaxData method', function () {
    const data = {
      a: 12
    };
    const url = axios._jointAjaxData(data);
    assert(url, '?a=12&');
    console.log(getTag({}));
  });
  it('test state:401 callback', async () => {
    await axios.get(`${url}test/401`);
  });
  it('test state:500 callback', async () => {
    await axios.get(`${url}test/500`);
  });
  it('test state:501 callback', async () => {
    await axios
      .get(`${url}test/501`)
      .then(() => {
        assert.fail('未达到预期');
      })
      .catch(() => {
        assert.ok(true);
        console.log('达到预期');
      });
  });
  it('test interceptors', async () => {
    await axios.get(`${url}test/501`);
  });
});

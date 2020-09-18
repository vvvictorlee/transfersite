// 一个没有监听端口的 Express 实例
const app = require('../js/app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库
const assert = require('power-assert');

describe('# test router api merchant', function () {
    // 同步测试
    it('a', function() {
        assert(1 === 1);
    });
    // 异步测试
    // 异步中，done 在异步结束后执行
    it('aa', function (done) {
        request
            .post('/hello') // 接口地址
            .send({"ss":"sss"})
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                // assert.equal(res.body.success, true, '商家id为1有值');
                // assert(Object.prototype.toString.call(res.body.data) === '[object Object]', '商家信息应该是一个对象');
                // assert.equal(res.body.data.id, 1, '商家id为1');
                // console.log(res);
                done();
            });
    });
});
// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库
const assert = require('power-assert');
const prefix = '/farm';
describe('# test router api merchant', function () {
    // 同步测试
    it('post', function () {
        assert(1 === 1);
    });
    // 异步测试
    // 异步中，done 在异步结束后执行
    it('get_eth_pairs_info', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_eth_pairs_info",
                "address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });

    it('get_pairtokens_info', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_pairtokens_info",
                "address": "0xFC9C4C0e17c3A3139a77d86282eCf18687C14780"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });

    it('get_pairs_info', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_pairs_info"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });


    it('get_swp_balance', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_swp_balance",
                "address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });

    it('get_swp_info', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_swp_info"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });

    it('default', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "unknown method"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });


});
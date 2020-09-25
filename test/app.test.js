// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库
const assert = require('power-assert');
const prefix = '/claim';

describe('# test router api merchant', function () {
    // 异步测试
    // 异步中，done 在异步结束后执行
    it('get reward list', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_reward_list",
                "address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });

    it('claim all rewards', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "claim_all_rewards",
                "address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
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



describe('# test list after claim', function () {

    before(function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "claim_all_rewards",
                "address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });

        
    });

    it('get list after claim rewards', function (done) {
        request
            .post(prefix) // 接口地址
            .send({
                "method": "get_reward_list",
                "address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
            })
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                console.log(res.body);
                done();
            });
    });


});
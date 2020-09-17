开始测试
了解了背景和框架后,正式开启测试
添加依赖
```
npm install --save-dev mocha mochawesome should supertest
```
复制代码在scripts中添加命令
```
"mochawesome": "./node_modules/.bin/mocha --reporter mochawesome",
"dev": "node index.js"
```
复制代码mochawesome生成报告
dev启动项目
注册接口的测试

从注册接口中,我得知该接口返回两个状态码,分别是200和500,对应的注册成功和注册失败
那么测试中就有两个注册成功和失败的测试用例
每个测试用例针对每个状态返回的值判断
通过即可
不通过,要么是接口有问题,要么是写的测试有问题

````
/**
 * @api {post} /v1/auth/register User Register
 * @apiName UserRegister
 * @apiGroup userAuthentication
 *
 * @apiParam {String} username  New user's name.
 * @apiParam {String} password  New user's password.
 *
 * @apiSuccess {String} username  The username of the register user.
 * @apiSuccess {string} message  The registering success info.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "gushen",
 *       "message": "User registered successful"
 *     }
 *
 * @apiError REGISTER_FAILURE The register failure.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "err": "REGISTER_FAILURE",
 *      "message": "User register failure!"
 *    }
 */
router.post('/register', function(req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err) {
    if (err) {
      log.error(err);
      res.status(500).json({
        err: 'REGISTER_FAILURE',
        message: AUTH_ERR.REGISTER_FAILURE
      });
      return;
    }

    log.info('user ' + req.body.username + ' registered successful!');
    res.json({
      username: req.body.username,
      message: 'User registered successful'
    });

  });
});
````

复制代码
UserRegister是第二层套件
POST /register是第三层套件
register success是测试用例名称
it的方法是测试用例的方法
请求url地址
发送post请求
发送用户名和密码
断言状态码
断言返回的值
执行下一步

注意: 每个测试用例结束后必须带上done,否则没有结束标识,会超时报错
  // 测试注册接口
```
  describe('UserRegister', function() {
    describe('POST /register', function() {
      // eslint-disable-next-line max-len
      it('register success', function(done) {
        request(url)
          .post('/api/v1/auth/register')
          .send(user)
          .expect(200)
          .end(function(err, res) {
            res.body.should.containEql({
              message: 'User registered successful'
            });
            if (err) throw err;
            done();
          });
      });
      it('repeated registration failure.', function(done) {
        request(url)
          .post('/api/v1/auth/register')
          .send(user)
          .expect(500)
          .end(function(err, res) {
            res.body.should.containEql({
              err: 'REGISTER_FAILURE'
            });
            if (err) throw err;
            done();
          });
      });
    });
  });
```

复制代码登录接口的测试
没什么好讲的,同测试注册接口步骤一致

```
  describe('UserLogin', function() {
    describe('POST /login', function() {
      it('login success', function(done) {
        request(url)
          .post('/api/v1/auth/login')
          .send(user)
          .expect(200)
          .end(function(err, res) {
            res.body.should.containEql({
              message: 'Authentication Success'
            });
            if (err) throw err;
            done();
          });
      });
      it('USER_NOT_EXIST.', function(done) {
        request(url)
          .post('/api/v1/auth/login')
          .send({
            username: 'a',
            password: 'admin'
          })
          .expect(200)
          .end(function(err, res) {
            res.body.should.containEql({
              err: 'USER_NOT_EXIST'
            });
            if (err) throw err;
            done();
          });
      });
    });
  });
```

复制代码权限验证的测试

权限验证就有点不一样了,因为验证权限前必须先登录,这时候就要用上mocha的钩子
权限是通过cookie验证,所以验证前必须要带上cookie
在before钩子中加入

```
userCookie = res.header['set-cookie'];
```

复制代码
在断言的请求中带上Cookie

```
.set('Cookie', userCookie)
复制代码// 权限验证
  describe('UserAuthInfo', function() {
    describe('GET /api/v1/auth/', function() {
      // 没有登录,权限验证
      it('The current User was not login.', function(done) {
        request(url)
          .get('/api/v1/auth/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {
            res.body.should.containEql({
              err: 'NOT_LOGIN'
            });
            if (err) throw err;
            done();
          });
      });
      // 权限验证前先登录
      beforeEach(function(done) {
        request(url)
          .post('/api/v1/auth/login')
          .send(user)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            if (!err) {
              userCookie = res.header['set-cookie'];
              done();
            }
          });
      });
      it('The username of the current user.', function(done) {
        request(url)
          .get('/api/v1/auth/')
          .set('Cookie', userCookie)
          .expect(200)
          .end(function(err, res) {
            res.body.should.have.keys('username');
            if (err) throw err;
            done();
          });
      });
    });
  });

```

复制代码更改用户密码的测试
更改用户密码前先注册-登录
  // 测试更改用户密码接口
```
  describe('UserChangePassword', function() {
    describe('POST /changepassword', function() {
      // 更改用户密码前先注册-登录
      // eslint-disable-next-line no-undef
      before(function(done) {
        request(url)
          .post('/api/v1/auth/register')
          .send(user2)
          .end(function(err, res) {
            if (err) throw err;
            done();
          });
      });
      // eslint-disable-next-line no-undef
      before(function(done) {
        request(url)
          .post('/api/v1/auth/login')
          .send(user2)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            if (!err) {
              userCookie = res.header['set-cookie'];
              done();
            }
          });
      });
      it('change password successful', function(done) {
        request(url)
          .post('/api/v1/auth/changepassword')
          .set('Cookie', userCookie)
          .send(newUser2)
          .expect(200)
          .end(function(err, res) {
            res.body.should.containEql({
              message: 'change password successful'
            });
            if (err) throw err;
            done();
          });
      });
      it('AUTHENTICATE_FAILURE', function(done) {
        request(url)
          .post('/api/v1/auth/changepassword')
          .set('Cookie', userCookie)
          .send(newUser2)
          .expect(401)
          .end(function(err, res) {
            res.body.should.containEql({
              err: 'AUTHENTICATE_FAILURE'
            });
            if (err) throw err;
            done();
          });
      });
      // after(function(done) {
      //   request(url)
      //   .post('/api/v1/auth/login')
      //   .send(user22)
      //   .set('Accept', 'application/json')
      //   .end(function(err, res) {
      //     if (!err) {
      //       userCookie = res.header['set-cookie'];
      //       done();
      //     }
      //   });
      // });
      // after(function(done) {
      //   request(url)
      //   .post('/api/v1/auth/changepassword')
      //   .set('Cookie', userCookie)
      //   .send(oldUser2)
      //   .expect(200)
      //   .end(function(err, res) {
      //     res.body.should.containEql({
      //       message: 'rechange password successful'
      //     });
      //     if (err) throw err;
      //     done();
      //   });
      // });
    });
  });

```



mocha 的 --grep 选项:

1
-g, --grep <pattern>            only run tests matching <pattern>
还可以使用正则表达式进行匹配，例如 test.js:







## Express 使用 Mocha、nyc 做单元、覆盖测试
expressmochasupertest
发布于 2018-02-09
Mocha
Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

GitHub仓库：Mocha

nyc
JavaScript test coverage made simple.

GitHub仓库：nyc

supertest
The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.

GitHub仓库：supertest

power-assert
Power Assert in JavaScript. Provides descriptive assertion messages through standard assert interface. No API is the best API.

GitHub仓库：power-assert

开发环境
node: v8.9.3
npm: 5.6.0
以上四个库、框架，都是本地安装，没有全局安装，很多教程中都推荐 Mocha、nyc全局安装。

在 package.json 的 scripts 中添加两个命令：
```
{
    "scripts": {
        "test": "export NODE_ENV=test PORT=3300 && mocha 'test/**/*.test.js' --exit",
         "cov": "export NODE_ENV=test PORT=3300 && nyc mocha 'test/**/*.test.js' --exit"
    }
}
```
--exit 表示在 Mocha 测试结束后，退出所有进程。如果不加这个，在用例中引入的 Express 实例会一直运行着，不会退出。

npm run test 是测试，npm run cov 是测试加覆盖测试，测试用例指定为根目录的 test 文件夹下所有 *.test.js 文件。

测试用例
贴一个简单的测试用例代码
```
// 一个没有监听端口的 Express 实例
const app = require('your-path/app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库
const assert = require('power-assert');

describe('# test router api merchant', function () {
    // 同步测试
    it('POST /api/admin/merchant', function() {
        assert(1 === 1);
    });
    // 异步测试
    // 异步中，done 在异步结束后执行
    it('GET /api/merchant?id=1', function (done) {
        request
            .get('/api/merchant?id=1') // 接口地址
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                assert.equal(res.body.success, true, '商家id为1有值');
                assert(Object.prototype.toString.call(res.body.data) === '[object Object]', '商家信息应该是一个对象');
                assert.equal(res.body.data.id, 1, '商家id为1');
                done();
            });
    });
});
````
控制台运行 npm run test，会打印大概如下信息，标识都通过了。

# test router api merchant
    ✓ POST /api/admin/merchant
    ✓ GET /api/merchant?id=1 (155ms)
覆盖测试
控制台运行 npm run cov，会打印大概如下信息。

首先是测试用例的情况，然后是代码覆盖的情况。

具体引用了哪些文件，哪些地方没有覆盖到，都会有对应的信息。

为了覆盖的更多，在写测试用例的时候，会对一个接口多写几种不同的状态


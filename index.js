const express = require('express');
const app = express();
const path = require('path');


//设置模板引擎
app.set('view engine', 'ejs');
//设置模板文件目录
app.set('views', path.resolve(__dirname, './views'));

// 设置静态文件目录
// app.use(express.static(path.resolve(__dirname, './public/html')));
//设置请求体解析中间件
app.use(express.urlencoded({ extended: true }));
//设置cookie解析中间件
const cookieParser =  require('cookie-parser');
app.use(cookieParser());
//设置uuid生成中间件
const uuid = require('uuid').v4;
//设置session中间件
const session = require('express-session');
//设置session仓库
const FileStore = require('session-file-store')(session);
app.use(session({
    store : new FileStore({
        //指定session存储目录
        path : path.resolve(__dirname, './session_store'),
        //加密
        secret : 'abcd1234',
        //session有效时间 单位 秒
        ttl : 3600,
        //默认情况下，file-store会每间隔一个小时，清理一次过期的session文件, 单位 秒
        reapInterval : 3600

    }),
    secret : 'my_secret_key'
}));


//启动服务器
app.listen(3000, () => {
    console.log('服务器启动成功，访问地址：http://localhost:3000');
});

//导入用户路由模块
const user_route = require(path.resolve(__dirname, './routes/user.js'));
app.use('/users', user_route);

const login_route = require(path.resolve(__dirname, './routes/login.js'));
app.use('/auth', login_route);

app.use((require, response) => {
    response.status(404).send('您访问的资源不存在！');
});
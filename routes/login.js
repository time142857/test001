const e = require('express');
const express = require('express');
const route = express.Router();
const path = require('path');
const uuid = require('uuid').v4;

route.get('/login_page', (require, response) => {
    console.log(uuid());
    response.render('login');
});

route.post('/login', (require, response) => {
    const username = require.body.username;
    const password = require.body.password;

    if(username === 'admin' && password === '123'){
        require.session.username = username;
        require.session.password = password;
        require.session.save(()=>{
            response.redirect('/users/list');
        });
    }else{
        response.send('登录失败！');
    }
});

route.get('/logout', (require, response) => {
    require.session.destroy((err)=>{
        if(err){
            response.status(500).send('退出登录失败！');
        }else{
            response.redirect('/auth/login_page');
        }
    });
});

module.exports = route;
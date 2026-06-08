const express = require('express');
const route = express.Router();
const path = require('path');
const fs = require('node:fs/promises');

let users_table = require(path.resolve(__dirname, '../Data/users.json'));


//权限验证
route.use((require, response, next)=>{
    if(require.session.username === 'admin' && require.session.password === '123'){
        next();
    }else{
        response.redirect('/auth/login_page');
    }
});


// 显示用户列表
route.get('/list', (require, response) => {
    if (require.session.username === 'admin' && require.session.password === '123') {
        console.log(JSON.stringify(users_table));
        response.render('users', { users: users_table, username: require.session.username });
    } else {
        response.redirect('/auth/login_page');
    }
});


// 添加用户
route.post('/add_user', (require, response) => {
    let id = users_table.at(-1).id + 1;
    if (id === undefined) {
        id = 1;
    }
    const user = {
        id: id,
        name: require.body.name,
        age: require.body.age,
        gender: require.body.gender,
        address: require.body.address
    };
    users_table.push(user);
    console.log('添加用户成功：', user);
    //有表单冲提交的风险
    // response.render('users', {users : users_table});

    console.log(path.resolve(__dirname, '../Data/users.json'));
    fs.writeFile(path.resolve(__dirname, '../Data/users.json'), JSON.stringify(users_table)).then(() => {
        response.redirect('/users/list');
    }).catch((err) => {
        response.status(500).send('服务器错误，添加用户失败！');
    });
});



// 删除用户
route.get('/delete_user', (require, response) => {
    let id = parseInt(require.query.id);
    users_table = users_table.filter((user) => {
        return user.id != id;
    });
    fs.writeFile(path.resolve(__dirname, '../Data/users.json'), JSON.stringify(users_table))
        .then((r) => {
            console.log('删除用户成功，id：', id);
        }).catch((err) => {
            response.status(500).send('服务器错误，删除用户失败！');
        });
    response.redirect('/users/list');
});


// 显示修改用户页面
route.get('/update_page', (require, response) => {
    let id = require.query.id;
    let user = users_table.find((user) => {
        return user.id == id;
    });
    response.render('update_page', { user: user });
});


// 修改用户
route.post('/update_user', (require, response) => {
    let user = require.body;
    console.log(user);
    let u = users_table.find((usr) => {
        return usr.id == user.id;
    });
    u.name = user.name;
    u.age = user.age;
    u.gender = user.gender;
    u.address = user.address;
    fs.writeFile(path.resolve(__dirname, '../Data/users.json'), JSON.stringify(users_table)).then(() => {
        console.log('修改用户成功，id：', user.id);
    }).catch((err) => {
        response.status(500).send('服务器错误，修改用户失败！');
    });
    response.redirect('/users/list');
});


module.exports = route;
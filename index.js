"use strict";
const weiboLogin = require('./lib/weibo_login.js').weiboLogin;
const request = require('request');
const fs = require('fs');
const querystring = require('querystring');
(async() => {
    const userInfoHTML = await new weiboLogin('username', 'password').init();
    let userInfoData=userInfoHTML.match(/{(.*)}/gi);
    userInfoData = JSON.parse(userInfoData);
    // console.log('userInfo ===================== ', userInfoData);
    let result;
    try{
        // result = await getHtml();
        // result = await toggleLike();
        // result = await follow(userInfoData.userinfo.uniqueid);
        result = await checkin();
    } catch(e){
        console.log(e);
        return;
    }
    console.log(result);

})()
// 获取登录成功后的html的一个示例
function getHtml(url) {
    // 构造
    // 读取获取到的cookies文件
    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        'cookie': cookies.toString()
    };
    let options = {
        method: 'GET',
        url: 'http://weibo.com/aj/v6/mblog/info/big?ajwvr=6&id=3916111844092586&__rnd=1486973483389', // 此url可以自己构造，这里是某个微博评论页面：http://weibo.com/1745602624/D6L8QhaFs?type=repost 的json接口，
        headers: headers,
        gzip: true
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                resolve(response.body);
            } else {
                reject(error);
            }
        })
    })

}

function toggleLike(mid = 4283811094856047, chaohua = '1008089470188e683443b4ac25eafac100278f') {
    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        "Referer": `https://weibo.com/p/${chaohua}/super_index`,
        'cookie': cookies.toString()
    };
    let options = {
        method: 'POST',
        url: 'https://weibo.com/aj/v6/like/add?ajwvr=6&__rnd=',
        headers: headers,
        gzip: true
    }
    return new Promise((resolve, reject) => {
        request({
            ...options,
            credentials: "include", // include, same-origin, *omit
            body: `mid=${mid}`,
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                resolve(response.body);
            } else {
                reject(error);
            }
        })
    })
}

function follow(uid=2216389422, chaohua = '1008089470188e683443b4ac25eafac100278f'){
    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        "Referer": `https://weibo.com/p/${chaohua}/super_index`,
        'cookie': cookies.toString()
    };
    let options = {
        method: 'POST',
        url: 'https://weibo.com/aj/proxy?ajwvr=6&__rnd=',
        headers: headers,
        gzip: true
    }
    return new Promise((resolve, reject) => {
        request({
            ...options,
            credentials: "include", // include, same-origin, *omit
            body: querystring.stringify({
                uid: uid,
                objectid:`1022%3A${chaohua}`,
                f:1,
                location: `page_${chaohua.slice(0, 6)}_super_index`,
                oid: `${chaohua.slice(6)}`,
                wforce: 1,
                nogroup: 1,
                template: 4,
                isinterest: true,
                api: `http://i.huati.weibo.com/aj/superfollow`,
                pageid: `${chaohua}`,
                reload: 1,
                _t:0
            })
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                resolve(response.body);
            } else {
                reject(error);
            }
        })
    })
}

function checkin(chaohua = '1008089470188e683443b4ac25eafac100278f'){
    let url = `https://weibo.com/p/aj/general/button`;

    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        "Referer": `https://weibo.com/p/${chaohua}/super_index`,
        'cookie': cookies.toString()
    };
    let options = {
        method: 'GET',
        url: `${url}?ajwvr=6&api=http://i.huati.weibo.com/aj/super/checkin&status=1&id=${chaohua}&location=page_${chaohua.slice(0, 6)}_super_index`,
        headers: headers,
        gzip: true
    }
    return new Promise((resolve, reject) => {
        request({
            ...options,
            credentials: "include"
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                resolve(response.body);
            } else {
                reject(error);
            }
        })
    })
}
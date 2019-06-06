/**
 * Created by m1833 on 2018/7/11.
 */
/**
 * 多环境配置，支持打包dev、test、prod等任意套环境的配置和选取。每套环境中可配置baseUrl、assetsPublicPath
 * 参考：vuejs添加环境常量----多环境开发打包场景解决方案之一 - 个人文章 - SegmentFault 思否  https://segmentfault.com/a/1190000014899779?utm_source=channel-hottest
 * Created by m1833 on 2018/7/10.
 */
/*
 使用方法示例：
 打包：
 打包dev环境：npm run build --dev
 打包test环境：npm run build --test
 打包pro环境：npm run build --pro
 本地运行：
 本地运行dev环境：npm run dev --dev
 本地运行test环境：npm run dev --test
 无【--xxx】参数，则默认为dev环境：npm run dev
 */
'use strict'

const chalk = require('chalk')
const path = require('path')
/*
 * 环境列表，第一个环境为默认环境
 * envName: 指明现在使用的环境
 * dirName: 打包的路径，只在build的时候有用
 * baseUrl: 这个环境下面的api 请求的域名
 * assetsPublicPath: 静态资源存放的域名，未指定则使用相对路径
 * */
const ENV_LIST = [
    {
        //开发环境
        envName: 'dev',
        dirName: 'dev',
        // baseUrl: 'http://192.168.1.5',  //ajax请求的baseUrl 王安
        baseUrl: 'http://192.168.1.14',  //ajax请求的baseUrl 帅齐
        commonPort:':8770',
        assetsPublicPath:'/',

    },
    {
        //测试环境
        envName: 'test',
        dirName: path.resolve(__dirname, '../../dist/'),
        baseUrl: 'http://47.104.24.10',
        // baseUrl: 'https://www.guohetech.com/ins_consumer',
        commonPort:'8770',//改这里    :8770
        assetsPublicPath:'/',
    },
    {
        //生产环境（命令行参数（process.arg）中prod是保留字，所以使用pro）
        envName: 'pro',
        dirName: path.resolve(__dirname, '../../release/'),
        // baseUrl: 'http://47.104.104.38',//改这里
        baseUrl: 'https://service.supplyfintech.com/ins_consumer',//改这里
        baseShortUrl: 'https://service.supplyfintech.com',
        commonPort:'',//改这里 :8765
        assetsPublicPath: '/',

    },
]

console.log("process.env.assetsPublicPath="+process.env.assetsPublicPath)
//获取命令行参数 http://nodejs.cn/api/process.html#process_process_argv
const argv = JSON.parse(process.env.npm_config_argv).original || process.argv
const HOST_ENV = argv[2] ? argv[2].replace(/[^a-z]+/ig,"") : ''
//没有设置环境，则默认为第一个
const HOST_CONF = HOST_ENV  ? ENV_LIST.find(item => item.envName === HOST_ENV) : ENV_LIST[0]
// 把环境常量挂载到process.env.HOST_ENV方便客户端使用
process.env.envName = HOST_CONF.envName
process.env.BASE_URL = HOST_CONF.baseUrl

process.env.commonPort = HOST_CONF.commonPort


// process.env.assetsRoot= HOST_CONF.dirName
// process.env.assetsPublicPath= HOST_CONF.assetsPublicPath
// log选中的变量
console.log(chalk.green('当前环境：'))
console.log(HOST_ENV)
console.log(chalk.green('当前环境对应的常量：'))
console.log(HOST_CONF)


module.exports.HOST_CONF = HOST_CONF
module.exports.ENV_LIST = ENV_LIST


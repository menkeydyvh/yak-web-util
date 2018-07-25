// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const fs = require('fs')


let config = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../app/view/webadmin.html'),   //html 生成位置
    assetsRoot: path.resolve(__dirname, '../../app/public/webadmin'),
    assetsSubDirectory: '',
    assetsPublicPath: '/public/webadmin/',
    // assetsPublicPath: '/assets/advisorq/',  // php 部署
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'web',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/spider/api'
        }
      }
    },
    cssSourceMap: false
  }
}

if (fs.existsSync(__dirname + '/index-local.js')) {
  console.log("加载本地配置");
  let local = require('./index-local')
  config.dev = Object.assign(config.dev, local.dev)
}

module.exports = config;


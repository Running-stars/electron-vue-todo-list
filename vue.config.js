const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // 相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  pages: {
    // 多页面打包
    main: {
      entry: 'src/modules/main/main.js',
      template: 'public/main.html',
      filename: 'main.html', // 在 dist 中生成的html文件名字
      title: 'main page'
    },
    remind: {
      entry: 'src/modules/remind/remind.js',
      template: 'public/remind.html',
      filename: 'remind.html', // 在 dist 中生成的html文件名字
      title: 'remind page'
    }
  }
})

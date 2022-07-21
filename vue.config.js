const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // 相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      customFileProtocol: "./", // 打包后element-ui的图标无法显示 是路径问题
      builderOptions: {
        "appId": "this.is.todo-list",
        "productName": "TodoList",
        "copyright": "Copyright © 2022 markZhou",
        "directories": {
          "buildResources": "build", //指定打包需要的静态资源，默认是build
          "output": "dist",  //打包生成的目录，默认是dist
        },
        "win": {
          "target": [
            "msi",
            "nsis" //安装包的格式，默认是"nsis"
          ],
          "icon": "build/icons/icon.ico" //安装包的图标
        },
        "nsis": {
          "oneClick": false, //是否一键安装，默认为true
          "language": "2052", //安装语言，2052对应中文
          "perMachine": false, //为当前系统的所有用户安装该应用程序
          "allowToChangeInstallationDirectory": true //允许用户选择安装目录
        },
        "publish": [
          {
            "provider": "generic",
            "url": "http://127.0.0.1:8080/static/win32/"  // 检测更新的包地址
          },
        ]
      },
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

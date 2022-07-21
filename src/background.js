// 'use strict'

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, screen, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const { autoUpdater } = require('electron-updater')
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const iconPath = path.join(__static, 'icon.png')

const AutoLaunch = require('auto-launch'); //开机启动方案一
let myAutoLaunch; //开机启动方案一


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// 禁止双开多开
const additionalData = { myKey: 'myValue' };
const gotTheLock = app.requestSingleInstanceLock(additionalData);
if (!gotTheLock) {
  app.quit()
}

let win,remindWindow,tray;
async function createWindow() {
    win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无边框窗口
    icon: iconPath,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器
      // enableRemoteModule: true
    }
  })
  console.log('111',process.env.ELECTRON_NODE_INTEGRATION)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/main.html')
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/main.html`)
  }
  win.removeMenu(); // 移除菜单项
  win.webContents.openDevTools(); // 打开控制台
  setTray();
}

// 开机启动配置,开机启动方案
myAutoLaunch = new AutoLaunch({
  name: app.name,
});


// 设置托盘
function setTray () {
  tray = new Tray(iconPath)
  tray.setToolTip('todoList')
  tray.on('click', () => {
    if(win.isVisible()){
      win.hide()
    }else{
      win.show()
    }
  })
  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => app.quit()
      },
      {
        label: '开启开机自启动',
        click: () => {
          myAutoLaunch.enable(); //开机启动方案
        }
      },
      {
        label: '关闭开机自启动',
        click: () => () => {
          myAutoLaunch.disable(); //开机启动关闭方案
        }
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })

}

// windows系统窗口全部关闭会退出应用，与mac不一样.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
  // 只在重启应用时读取待完成任务列表
  win.webContents.on('did-finish-load', () => { // 页面加载后触发
    console.log(6666555888)
    win.show()
    win.webContents.send('restart')
  })
  checkUpdate(); //每次启动程序，就检查更新
})

// 监测通信主窗口关闭
ipcMain.on('mainWindow:close', () => {
  win.hide()
})

// 监测通信提示窗口关闭
ipcMain.on('remindWindow:close', () => {
  remindWindow.close()
})

// 监测获取版本号
ipcMain.handle('getVersion', async () => {
  const result = await new Promise((resolve,reject) => {
    resolve(app.getVersion())
  })
  return result
})

// 监测任务开始时间，时间结束显示提示窗口
ipcMain.on('setTaskTime', (e, time, name) => {
  let now = new Date()
  let date = new Date()
  date.setHours(time.slice(0,2), time.slice(3),0)
  let timeout = date.getTime() - now.getTime()
  setTimeout(() => {
    createRemindWindow(name);
  }, timeout)
})

async function createRemindWindow(task) {
  if(remindWindow) remindWindow.close();
  
  remindWindow = new BrowserWindow({
    width: 360,
    height: 450,
    frame: false, // 无边框窗口
    icon: iconPath,
    show: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    }
  })

  const size = screen.getPrimaryDisplay().workAreaSize; // 电脑屏幕宽高信息
  const { y } = tray.getBounds(); // 托盘位置信息
  const { height, width } = remindWindow.getBounds(); // 提示窗口位置信息
  const yPosition = process.platform === 'darwin' ? y : y - height; // 判断是否mac系统，显示是否减去提示窗口本身高度

  remindWindow.setBounds({
    x: size.width - width,
    y: yPosition,
    height,
    width 
  })

  remindWindow.removeMenu(); // 移除菜单项
  remindWindow.setAlwaysOnTop(true); // 显示层级在顶部

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await remindWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/remind.html')
    // if (!process.env.IS_TEST) remindWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    remindWindow.loadURL(`file://${__dirname}/remind.html`)
  }

  remindWindow.show();
  remindWindow.webContents.on('did-finish-load', () => { // 页面加载后触发,打包正式环境会触发，开发环境好像不会触发
    remindWindow.webContents.send('setTask', task)
  })

  // setTimeout( () => {
  //   remindWindow.webContents.send('setTask', task); // 开发环境好像不会触发 did-finish-load 事件，所以用定时器代替
  // }, 0)

  remindWindow.on('closed', () => { remindWindow = null })
  setTimeout( () => {
    remindWindow && remindWindow.close()
  }, 50 * 1000)
}


// 版本检测更新
function checkUpdate() {
  if(process.platform == 'darwin') {
    //我们使用koa-static或http-server将静态目录设置成了static文件夹，
    //所以访问http://127.0.0.1:8080/static/win32/，就相当于访问了static/darwin文件夹，win32同理
    autoUpdater.setFeedURL('http://127.0.0.1:8080/static/darwin/')  //设置要检测更新的路径
  }else {
    console.log('hellokkk')
    autoUpdater.setFeedURL('http://127.0.0.1:8080/static/win32/')
  }

  //检测更新
  autoUpdater.checkForUpdates();

  //监听'error'事件
  autoUpdater.on('error', (err) => {
    console.log(err)
  })

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    console.log('发现新版本');
    createRemindWindow('发现新版本，更新版本')
  })

  // autoUpdater.autoDownload = false; // 默认会自动下载新版本，如果不想自动下载设为false

  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否更新？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if(buttonIndex.response == 0) {  //选择是(0)，则退出程序，安装新版本;否(1)则退出下一次重启打开程序是最新应用
        autoUpdater.quitAndInstall() 
        app.quit()
      }
    })
  })
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

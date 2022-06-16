// 'use strict'

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const iconPath = path.join(__static, 'icon.png')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

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
    win.loadURL(`app://${__dirname}/main.html`)
  }
  win.removeMenu(); // 移除菜单项
  // win.webContents.openDevTools(); // 打开控制台
  setTray();
}

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
})

// 监测通信主窗口关闭
ipcMain.on('mainWindow:close', () => {
  win.hide()
})

// 监测通信提示窗口关闭
ipcMain.on('remindWindow:close', () => {
  remindWindow.close()
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
    remindWindow.loadURL(`app://${__dirname}/remind.html`)
  }

  remindWindow.show();
  // remindWindow.webContents.on('did-finish-load', () => { // 页面加载后触发
  //   console.log('999',task)
  //   remindWindow.webContents.send('setTask', task)
  // })

  setTimeout( () => {
    remindWindow.webContents.send('setTask', task)
  }, 0)

  remindWindow.on('closed', () => { remindWindow = null })
  setTimeout( () => {
    remindWindow && remindWindow.close()
  }, 50 * 1000)
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

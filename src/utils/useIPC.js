const { ipcRenderer } = require('electron');


// 关闭主窗口
export function closeMain() {
  ipcRenderer.send('mainWindow:close')
}

// 关闭提示窗口
export function closeRemind() {
  ipcRenderer.send('remindWindow:close')
}

// 设置任务时间
export function setTaskTime(time, name) {
  ipcRenderer.send('setTaskTime', time, name)
}

// 只在重启应用时读取待完成任务列表
export function restartList(fn) {
  ipcRenderer.once('restart',fn)
}

export async function getVersion() {
  const result = await ipcRenderer.invoke('getVersion');
  return result
}


import { BrowserWindow, app } from "electron";
const path = require('path')

export let mainWindow: BrowserWindow

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      // 是否注入node模块
      nodeIntegration: true,
      // 允许使用webview
      webviewTag: true
    },
    // 应用icon Window
    icon: path.join(__dirname, './assets/logo.ico')
  });

  if (process.platform === 'darwin') {
    // Mac 图标
    app.dock.setIcon(path.join(__dirname, './assets/logo.ico'))
  }

  mainWindow.loadFile("dist/index.html")

  // 隐藏菜单栏
  mainWindow.menuBarVisible = false

  // 是否启动debug
  mainWindow.webContents.openDevTools({ mode: "detach" });
});

app.once("window-all-closed", () => app.quit());

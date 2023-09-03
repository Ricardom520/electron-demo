import { BrowserWindow, app, ipcMain } from "electron";
const path = require('path')

export let mainWindow: BrowserWindow

let loadingWindow: BrowserWindow

const createWindow = () => {
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

  // 隐藏菜单栏
  mainWindow.menuBarVisible = false

  // 是否启动debug
  mainWindow.webContents.openDevTools({ mode: "detach" });
  mainWindow.loadFile("dist/index.html")

  ipcMain.on('pageReady', (event, title) => {
    loadingWindow.destroy()
    mainWindow.show()
  })

  // ipcMain.handle("createNotebook", async (e, name: string) => {
  //   return await ioc.get(NotebooksController).create(name);
  // });
  
  // ipcMain.handle("getNotebooks", async () => {
  //   return await ioc.get(NotebooksController).getAll();
  // });
}

const showLoading = () => {
  loadingWindow = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
    },
    show: false,
    frame: false, // 无边框（窗口、工具栏等），只包含网页内容
    width: 700,
    height: 500,
    resizable: false,
    transparent: true, // 窗口是否支持透明，如果想做高级效果最好为true
    icon: path.join(__dirname, './assets/logo.ico')
  });
   
    // loadingWindow.once("show", cb);
  loadingWindow.loadFile('dist/loading.html');
  loadingWindow.show();

  ipcMain.on('pageReady', (event, title) => {
    console.log(title)
    if (title === 'loading') {
      setTimeout(() => {
        createWindow()
      }, 2000)
    }
  })
}

app.whenReady().then(() => {
   showLoading()
});

app.once("window-all-closed", () => app.quit());

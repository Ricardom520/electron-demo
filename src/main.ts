import path from "node:path";
import { BrowserWindow, app } from "electron";

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
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

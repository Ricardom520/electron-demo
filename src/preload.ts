const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  pageReady: (name: string) => ipcRenderer.send('pageReady', name)
})

console.log("preloaded!");

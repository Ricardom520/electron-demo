const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  pageReady: (name: string) => ipcRenderer.send('pageReady', name),
  createNotebook: (name: string) => {
    return ipcRenderer.invoke("createNotebook", name);
  },
  getNotebooks: () => {
    return ipcRenderer.invoke("getNotebooks");
  },
})

console.log("preloaded!");

// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openImage: (callback) => {
    ipcRenderer.invoke('openImageDialog').then(result => {
      if(!callback) return ;
      callback(result)
    }).catch((err) => {
      if(!callback) return ;
    })
  },
  updateImageWithUrl: (imageUrl, callback) => {
    ipcRenderer.invoke("updateImageWithUrl", { imageUrl }).then(() => {
        if(!callback) return ;
        callback()
    })
  },
  updateWithBase64: (base64, callback) => {
    ipcRenderer.invoke("updateWithBase64", { base64 }).then((result) => {
        if(!callback) return ;
        callback(result)
    })
  },
});
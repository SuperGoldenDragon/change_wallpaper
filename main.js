const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require('url');
const path = require('path');
const axios = require('axios');
const os = require('os');
const fs = require('fs');

const alertDialog = (msg) => {
  dialog.showMessageBox({
    type : 'info',
    title : "Result",
    message: msg,
    buttons: ['Ok']
  })
}

let mainWindow
async function createWindow () {
  const wallpaper = await import('wallpaper');
  mainWindow = new BrowserWindow({ 
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/electron-app/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.handle("openImageDialog", () => {
    const config = {
      title: 'Select image files.',
      buttonLabel: 'Select',
      filters: [{
          name: "Image files", extensions: ["jpg", "jpeg", "png"]
      }],
      properties: ['openFile']
    };
    const filenames = dialog.showOpenDialogSync(mainWindow, config) || [];
    if(!filenames || !filenames.length) {
      return
    };
    try {
      wallpaper.setWallpaper(filenames[0]).then(msg => alertDialog(JSON.stringify(msg))).catch(err => JSON.stringify(err))
    } catch (e) {
      console.log(e)
    }
  })

  ipcMain.handle("updateImageWithUrl", async (event, params) => {
    try {
      const wallpaper = await import('wallpaper');
      const { imageUrl } = params;
      console.log(imageUrl)
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });
      let picturePath = path.join(os.homedir(), "/Pictures", "background.jpg");
      const writer = fs.createWriteStream(picturePath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          wallpaper.setWallpaper(picturePath).then((result) => {
            resolve(result);
          }).catch((err) => {
            console.log(err)
          })          
        });
        writer.on('error', reject);
      });
    } catch (e) {
      console.log(e)
    }
  })

  ipcMain.handle("updateWithBase64", async (event, params) => {
    try {
      const wallpaper = await import('wallpaper');
      const { base64 } = params;
      let picturePath = path.join(os.homedir(), "/Pictures", "background.jpg");
      picturePath = path.normalize(picturePath);
      console.log(picturePath)
      return new Promise((resolve, reject) => {
        fs.writeFile(picturePath, base64, 'base64', (err) => {
          if(err) return ;
          wallpaper.setWallpaper(picturePath).then((result) => {
            resolve(result);
          }).catch((err) => {
          })  
        });
      })
    } catch (e) {
      console.log(e)
    }
  })
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

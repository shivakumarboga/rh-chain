const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron')
const path = require('path')
let win;
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()
}

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


ipcMain.on('screenshot:capture',(e, value) => { // The button which takes the screenshot
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize:{width: 1920, height:1080} })
        .then( sources => {
            let image  = sources[0].thumbnail.toDataURL() // The image to display the screenshot
            win.webContents.send('screenshot:captured', image);
        });
})
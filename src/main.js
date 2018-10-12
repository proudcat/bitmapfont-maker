const {
  app,
  BrowserWindow
} = require('electron')

// app.disableHardwareAcceleration()

let _mainWindow


function ready() {
  _mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  })

  _mainWindow.loadURL(`file://${__dirname}/public/index.html`)

  // Open the DevTools.
  _mainWindow.webContents.openDevTools()

  _mainWindow.on('closed', function () {
    _mainWindow = null
  })
}

app.on('ready', ready)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (_mainWindow === null) {
    ready()
  }
})
const {
  app,
  BrowserWindow
} = require('electron')

// app.disableHardwareAcceleration()

let _mainWindow


function ready() {

  _mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#2e2c29',
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false
    }
  })

  _mainWindow.on('closed', function () {
    _mainWindow = null
  })

  _mainWindow.once('ready-to-show', () => {
    _mainWindow.show()
    _mainWindow.maximize()
  })

  _mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  _mainWindow.webContents.openDevTools()

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
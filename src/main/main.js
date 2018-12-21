const {
  app,
  BrowserWindow
} = require('electron')

const path = require('path')

// app.disableHardwareAcceleration()

let _mainWindow

function ready() {

  let windowOptions = {
    show: false,
    backgroundColor: '#2e2c29',
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      // nodeIntegration: false
    }
  }

  _mainWindow = new BrowserWindow(windowOptions)

  _mainWindow.on('closed', function () {
    _mainWindow = null
  })

  _mainWindow.once('ready-to-show', () => {
    _mainWindow.show()
    _mainWindow.maximize()

    // Open the DevTools.
    _mainWindow.webContents.openDevTools()

  })

  _mainWindow.loadURL(`file://${path.join(__dirname, '../')}old.html`)
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
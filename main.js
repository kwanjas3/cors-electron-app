const {
  app,
  BrowserWindow
} = require('electron')
var cors_proxy = require('cors-anywhere');



let win

function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 100,
    webPreferences: {
      nodeIntegration: true
    }
  })


  win.loadFile('index.html')

  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || 'localhost';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 18765;

var server = cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],


}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
  global.serverHost = host + ':' + port;
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  server.close()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
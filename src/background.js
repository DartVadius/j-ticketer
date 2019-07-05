'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow
let configWindow
let popUpWindow

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createMainWindow () {
  // Create the browser window.
  const main = new BrowserWindow({
    title: 'J-Ticketer',
    width: 800,
    height: 600,
    backgroundColor: '#fef7ed',
    webPreferences: {
      nodeIntegration: true
    },
    center: true
  })

  let mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  main.setMenu(mainMenu)

  const config = new BrowserWindow({
    width: 600,
    height: 400,
    parent: main,
    webPreferences: {
      nodeIntegration: true
    },
    modal: true,
    show: false
  })

  let cofigMenu = Menu.buildFromTemplate(configMenuTemplate)
  config.setMenu(cofigMenu)

  const popup = new BrowserWindow({
    width: 600,
    height: 400,
    parent: main,
    webPreferences: {
      nodeIntegration: true
    },
    modal: true,
    show: false,
    frame: false
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    main.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    config.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/config')
    popup.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/popup')
    if (!process.env.IS_TEST) {
      main.webContents.openDevTools()
      config.webContents.openDevTools()
      popup.webContents.openDevTools()
    }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    main.loadURL('app://./index.html')
    config.loadURL(`file://${__dirname}/index.html#config`)
    popup.loadURL(`file://${__dirname}/index.html#popup`)
  }

  main.on('closed', () => {
    mainWindow = null
  })

  config.on('close', (e) => {
    e.preventDefault()
    config.hide()
  })

  configWindow = config
  popUpWindow = popup

  return main
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  mainWindow = createMainWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('toggle-config', () => {
  configWindow.isVisible() ? configWindow.hide() : configWindow.show()
})

ipcMain.on('toggle-popup', (event, value) => {
  data.text = value
})

ipcMain.on('close-popup', () => {
  popUpWindow.hide()
})

ipcMain.on('quit', () => {
  app.quit()
})

let data = {
  text: ''
}

const mainMenuTemplate = [
  {
    label: '?',
    submenu: [
      {
        label: 'Config',
        accelerator: 'CmdOrCtrl+z',
        click () {
          configWindow.isVisible() ? configWindow.hide() : configWindow.show()
        }
      },
      {
        label: 'About',
        click () {
          if (popUpWindow.isVisible()) {
            popUpWindow.hide()
          } else {
            popUpWindow.show()
            popUpWindow.webContents.send('popup-data', data)
          }
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+q',
        click () {
          app.quit()
        }
      }
    ]
  }
]

const configMenuTemplate = []

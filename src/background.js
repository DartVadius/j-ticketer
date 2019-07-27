'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu, session } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
import Store from 'electron-store'

const isDevelopment = process.env.NODE_ENV !== 'production'
const schema = {
  url: {
    type: 'string',
    format: 'url'
  }
}
const dataStore = new Store({
  schema,
  name: 'j-ticketer-data',
  cwd: 'user-data'
})

const filter = {
  urls: ['*']
}

let mainWindow
let configWindow
let popUpWindow

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: false, standard: true } }])

function createMainWindow () {
  // Create the browser window.
  const main = new BrowserWindow({
    title: 'J-Ticketer',
    width: 800,
    height: 600,
    // backgroundColor: '#fef7ed',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    center: true
  })

  let mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  main.setMenu(mainMenu)

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(mainMenu)
  }

  const config = new BrowserWindow({
    title: 'Config',
    width: 500,
    height: 220,
    resizable: false,
    parent: main,
    webPreferences: {
      nodeIntegration: true
    },
    modal: true,
    show: false,
    frame: false,
    backgroundColor: '#ffffff'
  })

  let cofigMenu = Menu.buildFromTemplate(configMenuTemplate)
  config.setMenu(cofigMenu)

  const popup = new BrowserWindow({
    title: 'About',
    width: 200,
    height: 150,
    resizable: false,
    movable: false,
    parent: main,
    webPreferences: {
      nodeIntegration: true
    },
    modal: true,
    show: false,
    frame: false,
    backgroundColor: '#ffffff'
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    main.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    config.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/config')
    popup.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/popup')
    if (!process.env.IS_TEST) {
      main.webContents.openDevTools()
      // config.webContents.openDevTools()
      // popup.webContents.openDevTools()
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
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    delete details.requestHeaders['User-Agent']
    /* eslint-disable-next-line */
    callback({ requestHeaders: details.requestHeaders })
  })
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

ipcMain.on('quit', () => {
  app.quit()
})

ipcMain.on('close-config', () => {
  configWindow.hide()
})

let data = {}

ipcMain.on('toggle-popup', (event, value) => {
  data = value
})

ipcMain.on('close-popup', () => {
  popUpWindow.hide()
})

ipcMain.on('save-config', (event, value) => {
  try {
    dataStore.set(value)
    let jiraConfig = getJiraConfig()
    if (jiraConfig.login && jiraConfig.password) {
      mainWindow.webContents.send('set-auth', {
        token: [jiraConfig.login, jiraConfig.password].join(':'),
        baseUrl: jiraConfig.url
      })
    }
    if (jiraConfig.locale) {
      mainWindow.webContents.send('set-locale', {
        locale: jiraConfig.locale
      })
    }
    configWindow.hide()
  } catch (e) {
    popUpWindow.show()
    popUpWindow.webContents.send('popup-data', {
      type: 'storage_error',
      storageError: e.message
    })
  }
})

ipcMain.on('clear-jira-config', () => {
  // dataStore.clear()
  dataStore.delete('login')
  dataStore.delete('password')
  dataStore.delete('url')
  configWindow.webContents.send('config-data', getJiraConfig())
})

const mainMenuTemplate = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Config',
        accelerator: 'CmdOrCtrl+z',
        click () {
          if (configWindow.isVisible()) {
            configWindow.hide()
          } else {
            configWindow.show()
            configWindow.webContents.send('config-data', getJiraConfig())
          }
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

function getJiraConfig () {
  return {
    login: dataStore.get('login'),
    password: dataStore.get('password'),
    url: dataStore.get('url'),
    locale: dataStore.get('locale')
  }
}

const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
require("@electron/remote/main").initialize();

const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true,
      devTools: isDev,
    },
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (!isDev) {
    const customMenuTemplate = [];

    const customMenu = Menu.buildFromTemplate(customMenuTemplate);
    Menu.setApplicationMenu(customMenu);
  }

  require("@electron/remote/main").enable(win.webContents);
  const buildURL = `file://${path.join(__dirname, "../build/index.html")}`;
  const currentURL = isDev ? "http://localhost:3000" : buildURL;

  win.loadURL(currentURL);

  // Handle open-file events in the production environment
  app.on("open-file", (event, filePath) => {
    event.preventDefault();
    win.webContents.send("file-path", filePath);
    ipcMain.on("request-file-path", (event) => {
      event.sender.send("file-path", filePath);
    });
  });
  if (process.argv.length >= 2) {
    let filePath = process.argv[1];
    win.webContents.send("file-path", filePath);
    ipcMain.on("request-file-path", (event) => {
      event.sender.send("file-path", filePath);
    });
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "android") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

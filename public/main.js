const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const { autoUpdater } = require("electron-updater");

require("@electron/remote/main").initialize();

const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 350,
    titleBarStyle: "hidden",
    backgroundColor: "#212529",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true,
      devTools: isDev,
    },
  });

  autoUpdater.setFeedURL({
    provider: "github",
    repo: "sif-code-desktop",
    owner: "dev-pengi",
    private: false,
  });

  // let updateWin;
  ipcMain.on("check-update", (event) => {
    let updateWin = new BrowserWindow({
      width: 350,
      height: 350,
      alwaysOnTop: true,
      resizable: false,
      titleBarStyle: "hidden",
      backgroundColor: "#212529",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        devTools: true,
      },
    });

    const updaterURL = `file://${path.join(__dirname, "./updater/index.html")}`;
    updateWin.loadURL(updaterURL);
    autoUpdater.checkForUpdates();

    ipcMain.on("request-update-info", (event) => {
      autoUpdater.on("update-available", (info) => {
        event.sender.send("update-available", info);
      });
      autoUpdater.on("update-not-available", (info) => {
        event.sender.send("update-not-available", info);
      });

      autoUpdater.on("update-downloaded", (info) => {
        event.sender.send("update-downloaded", info);
      });
      autoUpdater.on("checking-for-update", (info) => {
        event.sender.send("checking-for-update", info);
      });
      autoUpdater.on("error", (error, message) => {
        event.sender.send("error", error, message);
      });
    });

    ipcMain.on("close-updater", () => {
      updateWin.close();
    });
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

  ipcMain.on("editor-loaded", (event, arg) => {
    win.setSize(900, 650);
    win.maximize();
    win.setMinimumSize(700, 600);
    setTimeout(() => event.sender.send("editor-loaded-finished"), 1000);
  });

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

  ipcMain.on("close", () => {
    win.close();
  });

  ipcMain.on("minimize", () => {
    win.minimize();
  });

  ipcMain.on("maximize", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
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

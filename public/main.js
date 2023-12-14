const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");

require("@electron/remote/main").initialize();

const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 350,
    maximizable: false,
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

  const checkForUpdates = () => {
    autoUpdater.checkForUpdates();
    autoUpdater.on("update-downloaded", (info) => {
      autoUpdater.removeAllListeners("update-downloaded");
      dialog
        .showMessageBox(win, {
          type: "info",
          title: "Update Downloaded",
          message: "You need to restart the app to apply the update",
          buttons: ["Close app", "Cancel"],
          noLink: true,
        })
        .then((value) => {
          if (value.response === 0) {
            win.destroy();
          }
        });
    });
  };

  checkForUpdates();
  ipcMain.on("check-update", (event) => {
    checkForUpdates();
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

  ipcMain.on("editor-loaded", (event) => {
    win.setSize(900, 650);
    win.setMaximizable(true);
    win.maximize();
    win.setMinimumSize(700, 600);
    setTimeout(() => event.sender.send("editor-loaded-finished"), 800);
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
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

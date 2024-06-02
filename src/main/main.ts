/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron"s main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from "path";
import { app, BrowserWindow, shell, ipcMain, protocol, BrowserWindowConstructorOptions, net } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";
import { fileURLToPath } from "url";
import { WindowType } from "./WindowType";

const OPEN_DEVTOOLS_IN_DEBUG_MODE = false;

class AppUpdater {
    constructor() {
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on("ipc-example", async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply("ipc-example", msgTemplate("pong"));
});

if (process.env.NODE_ENV === "production") {
    const sourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
}

const isDebug =
    process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
    const electronDebug = require("electron-debug");
    electronDebug({
        showDevTools: OPEN_DEVTOOLS_IN_DEBUG_MODE
    });
}

const installExtensions = async () => {
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS"];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};

const createWindow = async () => {
    if (isDebug) {
        await installExtensions();
        //protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler); // TODO: Remove
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, "assets")
        : path.join(__dirname, "../../assets");

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        icon: getAssetPath("icon.png"),
        width: 1380, // 1024
        height: 940, // 728
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        //frame: false,
        roundedCorners: false, // macOS
        thickFrame: false,
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, "preload.js")
                : path.join(__dirname, "../../.erb/dll/preload.js"),
            contextIsolation: false,
            nodeIntegration: true,
        },
        // TODO: custom title bar
        //titleBarStyle: "hidden",
        //titleBarOverlay: {
        //    //color: "#0f121b",
        //    color: "#0f121b",
        //    symbolColor: "#ffffff",
        //    height: 33, // default: 44  -> 48 = 61
        //},
    });

    mainWindow.setMenu(null);

    mainWindow.webContents.setWindowOpenHandler((args) => {
        if (args.frameName === WindowType.ResizableBlockingPopup) {
            return {
                action: "allow",
                overrideBrowserWindowOptions: {
                    frame: true,
                    parent: mainWindow,
                    minWidth: 400,
                    minHeight: 400,
                    title: args.features,
                    modal: true,
                    minimizable: false,
                    skipTaskbar: true,
                    autoHideMenuBar: true,
                    // this would show window controls but no title bar.
                    //titleBarStyle: "hidden",
                    //titleBarOverlay: true,
                } as BrowserWindowConstructorOptions
            }
        }

        console.error(
            "Attempting to create a window with unknown frameName: " +
            args.frameName
        );

        return {
            action: "deny",
        }
    });

	//window.setMenuBarVisibility(false);

    //mainWindow.maximize();
    //mainWindow.minimize();
    //mainWindow.close();

    mainWindow.loadURL(resolveHtmlPath("index.html"));

    mainWindow.on("ready-to-show", () => {
        if (!mainWindow) {
            throw new Error("'mainWindow' is not defined");
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        }
        else {
            mainWindow.show();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    //const menuBuilder = new MenuBuilder(mainWindow);
    //menuBuilder.buildMenu();
    //
    //// Open urls in the user"s browser
    //mainWindow.webContents.setWindowOpenHandler((edata) => {
    //    shell.openExternal(edata.url);
    //    return { action: "deny" };
    //});

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.whenReady().then(() => {
    registerProtocols();
    createIpcMethods();
    createWindow();
    app.on("activate", () => {
        // On macOS it"s common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow();
    });
})
.catch(console.log);

function createIpcMethods () {
    //createIpcHandlers(ipcMain);
}

function registerProtocols () {
    protocol.registerFileProtocol("asset", (req, callback) => {
        const filePath = fileURLToPath(
            "file://" + req.url.slice("asset://".length)
        );
        callback(filePath);
    });
}
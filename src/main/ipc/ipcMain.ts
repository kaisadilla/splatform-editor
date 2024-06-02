import { getInstalledResourcePacks } from "../files/read";
import { HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY } from "./ipcNames";
import { spawn } from "child_process";

export function createIpcHandlers (ipcMain: Electron.IpcMain) {
    ipcMain.handle(HANDLER_SANITY, async (evt, obj) => {

        return {
            message: "Sanity check confirmed",
            object: obj,
        };
    });

    ipcMain.handle(HANDLER_LOAD_RESOURCE_PACKS, async (evt, obj) => {
        return await getInstalledResourcePacks();
    });
}
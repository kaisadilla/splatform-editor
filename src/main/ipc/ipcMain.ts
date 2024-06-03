import { getWinPath } from "../util";
import { openTextFile, saveNewTextFile } from "../files/documentFiles";
import { getInstalledResourcePacks, getUserdataFolderPath } from "../files/read";
import { HANDLER_GET_USERDATA_PATH, HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY, HANDLER_SAVE_NEW_TEXT_FILE, HANDLER_OPEN_TEXT_FILE } from "./ipcNames";

export function createIpcHandlers (ipcMain: Electron.IpcMain) {
    ipcMain.handle(HANDLER_SANITY, async (evt, obj) => {

        return {
            message: "Sanity check confirmed",
            object: obj,
        };
    });

    ipcMain.handle(HANDLER_GET_USERDATA_PATH, async (evt, obj) => {
        return getWinPath(await getUserdataFolderPath());
    });

    ipcMain.handle(HANDLER_LOAD_RESOURCE_PACKS, async (evt, args) => {
        return await getInstalledResourcePacks();
    });

    ipcMain.handle(HANDLER_OPEN_TEXT_FILE, async (evt, args: ReadTextFileArgs) => {
        return openTextFile(args.title, args.filters);
    });

    ipcMain.handle(HANDLER_SAVE_NEW_TEXT_FILE, async (evt, args: SaveNewTextFileArgs) => {
        return saveNewTextFile(args.title, args.content, args.filters);
    });
}

export interface ReadTextFileArgs {
    title: string;
    filters: Electron.FileFilter[];
}

export interface SaveNewTextFileArgs {
    title: string;
    content: string;
    filters: Electron.FileFilter[];
}
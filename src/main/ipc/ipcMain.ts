import { getWinPath } from "../util";
import { confirmDocumentClose, openTextFile, saveDocument, saveNewDocument, saveNewTextFile } from "../files/documentFiles";
import { getInstalledResourcePacks, getUserdataFolderPath } from "../files/gameData";
import { HANDLER_GET_USERDATA_PATH, HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY, HANDLER_SAVE_NEW_TEXT_FILE, HANDLER_OPEN_TEXT_FILE, HANDLER_CLOSE_DOCUMENT, HANDLER_SAVE_NEW_DOCUMENT, HANDLER_SAVE_DOCUMENT } from "./ipcNames";
import { SPDocumentType } from "models/sp_documents";

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

    ipcMain.handle(HANDLER_SAVE_DOCUMENT, async (evt, args: SaveDocumentArgs) => {
        return saveDocument(args.fullPath, args.content);
    });

    ipcMain.handle(HANDLER_SAVE_NEW_DOCUMENT, async (evt, args: SaveNewDocumentArgs) => {
        return saveNewDocument(args.type, args.content);
    });

    ipcMain.handle(HANDLER_CLOSE_DOCUMENT, async (evt, args: CloseDocumentArgs) => {
        return confirmDocumentClose(
            args.tabName, args.type, args.fullPath, args.content
        );
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

export interface SaveDocumentArgs {
    fullPath: string;
    content: string;
}

export interface SaveNewDocumentArgs {
    type: SPDocumentType;
    content: string;
}

export interface CloseDocumentArgs {
    /**
     * The name of the file displayed in its tab.
     */
    tabName: string;
    type: SPDocumentType;
    fullPath: string | null;
    content: string;
}
import { getWinPath } from "../files/fileOps";
import { confirmDocumentClose, createNewProject, directoryExists, openProject, openTextFile, saveDocument, saveNewBinary, saveNewDocument, saveNewTextFile, selectFolder } from "../files/documentFiles";
import { getInstalledResourcePacks, getUserdataFolderPath } from "../files/gameData";
import { HANDLER_GET_USERDATA_PATH, HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY, HANDLER_SAVE_NEW_TEXT_FILE, HANDLER_OPEN_TEXT_FILE, HANDLER_CLOSE_DOCUMENT, HANDLER_SAVE_NEW_DOCUMENT, HANDLER_SAVE_DOCUMENT, HANDLER_SAVE_BINARY, HANDLER_OPEN_DIRECTORY, HANDLER_DIRECTORY_EXISTS, HANDLER_CREATE_PROJECT, HANDLER_OPEN_PROJECT } from "./ipcNames";
import { SPBinaryType, SPDocumentType } from "models/sp_documents";

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

    ipcMain.handle(HANDLER_DIRECTORY_EXISTS, async (evt, path: string) => {
        return directoryExists(path);
    });

    ipcMain.handle(HANDLER_OPEN_TEXT_FILE, async (evt, args: ReadTextFileArgs) => {
        return openTextFile(args.title, args.filters);
    });

    ipcMain.handle(HANDLER_OPEN_DIRECTORY, async (evt, title: string) => {
        return selectFolder(title);
    });

    ipcMain.handle(HANDLER_OPEN_PROJECT, async (evt, title: string) => {
        return openProject(title);
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

    ipcMain.handle(HANDLER_CREATE_PROJECT, async (evt, args: CreateNewProjectArgs) => {
        return createNewProject(args.fullPath, args.name, args.pack);
    });

    ipcMain.handle(HANDLER_CLOSE_DOCUMENT, async (evt, args: CloseDocumentArgs) => {
        return confirmDocumentClose(
            args.tabName, args.type, args.fullPath, args.content
        );
    });

    ipcMain.handle(HANDLER_SAVE_BINARY, async (evt, args: SaveNewBinaryArgs) => {
        return saveNewBinary(args.type, args.content);
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

export interface CreateNewProjectArgs {
    fullPath: string;
    name: string;
    pack: string;
}

export interface SaveNewBinaryArgs {
    type: SPBinaryType;
    content: Uint8Array;
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
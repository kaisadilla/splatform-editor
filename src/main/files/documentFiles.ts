import { BrowserWindow, dialog } from "electron";
import fsAsync from "fs/promises";
import fs from "fs";
import Path from "path";
import { SPBinaryType, SPDocumentType } from "models/sp_documents";
import { MediaAssetMetadata } from "models/ResourcePack";

let parentWindow: BrowserWindow | null = null;

export interface FileInfo<T> {
    fileName: string;
    baseName: string;
    extension: string;
    fullPath: string;
    content: T;
}

export interface FolderInfo {
    folderName: string;
    fullPath: string;
    subfolders: string[];
}

export function setDialogParentWindow (window: BrowserWindow) {
    parentWindow = window;
}

export async function selectFolder (title: string) : Promise<FolderInfo | null> {
    const folderPath = dialog.showOpenDialogSync(parentWindow!, {
        title: title,
        properties: ['openDirectory'],
    });

    if (folderPath && folderPath[0]) {
        const path = Path.parse(folderPath[0]);
        const subfolders = (await fsAsync.readdir(folderPath[0], {
            withFileTypes: true,
        })).filter(e => e.isDirectory()).map(f => f.name);

        return {
            folderName: path.base,
            fullPath: folderPath[0],
            subfolders: subfolders,
        }
    }

    return null;
}

export function openTextFile (
    title: string,
    filters: Electron.FileFilter[],
) : FileInfo<string> | null {
    const filePath = dialog.showOpenDialogSync(parentWindow!, {
        title: title,
        filters: filters,
    });

    if (filePath && filePath[0]) {
        const path = Path.parse(filePath[0]);
        const content = fs.readFileSync(filePath[0]).toString();

        return {
            fileName: path.name,
            baseName: path.base,
            extension: path.ext,
            fullPath: filePath[0],
            content: content,
        };
    }

    return null;
}

export function saveNewTextFile (
    title: string,
    content: string,
    filters: Electron.FileFilter[]
) : string | null {
    const filePath = dialog.showSaveDialogSync(parentWindow!, {
        title: title,
        filters: filters,
    });

    if (filePath) {
        fs.writeFileSync(filePath, content);
    }

    return filePath ?? null;
}

export function saveNewBinaryFile (
    title: string,
    content: Uint8Array,
    filters: Electron.FileFilter[]
) : string | null {
    const filePath = dialog.showSaveDialogSync(parentWindow!, {
        title: title,
        filters: filters,
    });

    if (filePath) {
        fs.writeFileSync(filePath, content);
    }

    return filePath ?? null;
}

/**
 * Saves the document given to the path given.
 * @param fullPath The path of the file to save the content to.
 * @param content The content to save inside the file.
 */
export function saveDocument (fullPath: string, content: string) {
    fs.writeFileSync(fullPath, content);
}

/**
 * Prompts the user to select a path to save the file given.
 * @param type The type of document to save.
 * @param content The content of the document.
 * @returns The path to where the user saved the document, or `null` if the user
 * decided not to save it.
 */
export function saveNewDocument (
    type: SPDocumentType,
    content: string,
) : MediaAssetMetadata | null {
    let filePath = null as string | null;

    if (type == 'level') {
        filePath = saveNewTextFile("Save level", content, [
            {
                name: "SPlatform level",
                extensions: ["sp-lev"]
            },
            {
                name: "JSON file",
                extensions: ["json"]
            }
        ]);
    }
    else if (type == 'world') {
        filePath = saveNewTextFile("Save world", content, [
            {
                name: "SPlatform world",
                extensions: ["sp-wld"]
            },
            {
                name: "JSON file",
                extensions: ["json"]
            }
        ]);
    }
    else if (type == 'game') {
        filePath = saveNewTextFile("Save game", content, [{
            name: "SPlatform game",
            extensions: ["sp-gme", "json"]
        }]);
    }
    else if (type == 'entity') {
        filePath = saveNewTextFile("Save entity", content, [{
            name: "SPlatform entity",
            extensions: ["spr-ent", "json"]
        }]);
    }
    else if (type == 'tile') {
        filePath = saveNewTextFile("Save tile", content, [{
            name: "SPlatform tile",
            extensions: ["spr-til", "json"]
        }]);
    }
    else {
        console.error("Unknown file type: ", type);
    }

    if (filePath === null) return null;

    const path = Path.parse(filePath);

    return {
        id: filePath,
        baseName: path.base,
        fileName: path.name,
        extension: path.ext,
        fullPath: filePath
    };
}

export function confirmDocumentClose (
    tabName: string,
    type: SPDocumentType,
    fullPath: string | null,
    content: string
) : boolean {

    const SAVE_ID = 0;
    const DISCARD_ID = 1;
    const CANCEL_ID = 2;

    const resp = dialog.showMessageBoxSync(parentWindow!, {
        title: "Closing document",
        type: 'warning',
        message: `Do you want to save the changes you made to '${tabName}'?`,
        detail: "Your changes will be lost if you don't save them.",
        buttons: ["Save", "Discard", "Cancel"],
        defaultId: SAVE_ID,
        cancelId: CANCEL_ID,
        noLink: true,
    });

    if (resp == SAVE_ID) {
        if (fullPath === null) {
            saveNewDocument(type, content);
        }
        else {
            saveDocument(fullPath, content);
        }
    }

    // return 'true' when the document has been closed, false otherwise.
    return resp !== CANCEL_ID;
}

/**
 * Prompts the user to select a path to save the file given.
 * @param type The type of document to save.
 * @param content The content of the document.
 * @returns The path to where the user saved the document, or `null` if the user
 * decided not to save it.
 */
export function saveNewBinary (
    type: SPBinaryType,
    content: Uint8Array,
) : MediaAssetMetadata | null {
    let filePath = null as string | null;

    if (type == 'level') {
        filePath = saveNewBinaryFile("Save level binary", content, [{
            name: "SPlatform level binary",
            extensions: ["spb-l"]
        }]);
    }
    else if (type == 'game') {
        filePath = saveNewBinaryFile("Save game binary", content, [{
            name: "SPlatform game binary",
            extensions: ["spb-l"]
        }]);
    }
    else {
        console.error("Unknown file type: ", type);
    }

    if (filePath === null) return null;

    const path = Path.parse(filePath);

    return {
        id: filePath,
        baseName: path.base,
        fileName: path.name,
        extension: path.ext,
        fullPath: filePath
    };
}
import { dialog } from "electron";
import fsAsync from "fs/promises";
import fs from "fs";
import Path from "path";
import { SPDocumentType } from "models/sp_documents";

export interface FileInfo<T> {
    fileName: string;
    baseName: string;
    extension: string;
    fullPath: string;
    content: T;
}

export function openTextFile (
    title: string,
    filters: Electron.FileFilter[],
) : FileInfo<string> | null {
    const filePath = dialog.showOpenDialogSync({
        title: title,
        filters: filters,
    });

    if (filePath && filePath[0]) {
        const path = Path.parse(filePath[0]);
        const content =  fs.readFileSync(filePath[0]).toString();

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
) : string |null {
    const filePath = dialog.showSaveDialogSync({
        title: title,
        filters: filters,
    });

    if (filePath) {
        fs.writeFileSync(filePath, content);
    }

    return filePath ?? null;
}

export function saveNewDocument (
    type: SPDocumentType,
    content: string,
) : string | null {
    let filePath = null as string | null;

    if (type == 'level') {
        filePath = saveNewTextFile("Save level", content, [{
            name: "SPlatform level",
            extensions: ["sp-lev", "json"]
        }]);
    }
    else if (type == 'world') {
        filePath = saveNewTextFile("Save world", content, [{
            name: "SPlatform world",
            extensions: ["sp-wld", "json"]
        }]);
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

    return filePath;
}

export function confirmDocumentClose (
    type: SPDocumentType,
    fullPath: string | null,
    content: string
) : boolean {
    const SAVE_ID = 0;
    const DISCARD_ID = 1;
    const CANCEL_ID = 2;

    const resp = dialog.showMessageBoxSync({
        title: "Closing document",
        type: 'warning',
        message: "Do you want to save the changes you made to <base-name>?",
        detail: "Your changes will be lost if you don't save them.",
        buttons: ["Save", "Discard", "Cancel"],
        defaultId: SAVE_ID,
        cancelId: CANCEL_ID,
    });

    if (resp == SAVE_ID) {
        if (fullPath === null) {
            saveNewDocument(type, content);
        }
        else {
            fs.writeFileSync(fullPath, content);
        }
    }

    // return 'true' when the document has been closed, false otherwise.
    return resp !== CANCEL_ID;
}
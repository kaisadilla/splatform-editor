import { dialog } from "electron";
import fsAsync from "fs/promises";
import fs from "fs";
import Path from "path";

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
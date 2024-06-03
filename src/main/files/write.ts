import { dialog } from "electron";
import fsAsync from "fs/promises";
import fs from "fs";

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
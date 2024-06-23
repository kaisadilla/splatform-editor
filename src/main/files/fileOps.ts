import { FolderMetadata, FileMetadata } from "models/ResourcePack";
import fsAsync from "fs/promises";
import fs from "fs";
import Path from "path";

/**
 * Scans the given directory for all files with the extension given.
 * @param directory The directory to scan.
 * @param extensions The list of extensions the files can have.
 */
export async function scandirForFileType (
    directory: string, ...extensions: string[]
) {
    const results = await fsAsync.readdir(directory, {
        withFileTypes: true,
    });

    const targetedFiles = [] as FileMetadata[];

    for (const res of results) {
        if (res.isDirectory()) continue;

        const file = Path.parse(res.name);

        if (extensions.includes(file.ext)) {
            targetedFiles.push({
                id: file.name,
                fileName: file.name,
                baseName: file.base,
                extension: file.ext,
                fullPath: getWinPath(directory + "/" + res.name),
            });
        }
    }

    return targetedFiles;
}

/**
 * Scans the given directory for all folders inside it.
 * @param directory The directory to scan.
 */
export async function scandirForFolders (directory: string) {
    const results = await fsAsync.readdir(directory, {
        withFileTypes: true,
    });

    const folders = [] as FolderMetadata[];

    for (const res of results) {
        if (res.isDirectory() === false) continue;

        folders.push({
            id: res.name,
            name: res.name,
            fullPath: getWinPath(directory + "/" + res.name),
        });
    }

    return folders;
}

/**
 * Adjusts the path for the currenet operating system.
 * @param path The path to adjust.
 */
export function getWinPath (path: string) {
    return path.replaceAll("/", "\\");
}
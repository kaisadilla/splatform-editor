import fsAsync from "fs/promises";
import fs from "fs";
import Registry from "winreg";
import { DataAssetMetadata, MediaAssetMetadata, ResourcePack, ResourcePackManifest } from "models/ResourcePack";
import Path from "path";
import { Entity } from "models/Entity";
import { Tile } from "models/Tile";

const REGKEY_USER_FOLDER = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders';
const TEXT_FORMAT = "utf-8";

export async function getInstalledResourcePacks () {
    const start = Date.now();

    const personalFolder = await _getWindowsPersonalFolder();
    const resPath = personalFolder + "/My Games/SPlatform/resource-packs";

    const resFolders = (await fsAsync.readdir(resPath, {
        withFileTypes: true,
    })).filter(e => e.isDirectory()).map(f => f.name);

    const resourcePackFolders = [];
    
    for (const f of resFolders) {
        const folderPath = resPath + "/" + f;
        const manifestPath = folderPath + "/manifest.sm-res";

        if (fs.existsSync(manifestPath)) {
            const pack = await _readResourcePackFolder(folderPath);
            resourcePackFolders.push(pack);
        }
    }

    const end = Date.now();
    console.info(`Resource folders read in ${end - start} ms.`);

    return resourcePackFolders;
}

async function _readResourcePackFolder (path: string) : Promise<ResourcePack> {
    // replace removes UTF-8 with BOM characters.
    const manifestJson = _readTextFile(path + "/manifest.sm-res");
    const manifest: ResourcePackManifest = JSON.parse(manifestJson);

    const backgroundFiles = await _scandirForFileType(path + "/backgrounds", ".png");
    const musicFiles = await _scandirForFileType(path + "/music", ".wav", ".mp3");
    const soundFiles = await _scandirForFileType(path + "/sound", ".wav", ".mp3");
    const spriteEntityFiles = await _scandirForFileType(path + "/sprites/entities", ".png");
    const spriteParticleFiles = await _scandirForFileType(path + "/sprites/particles", ".png");
    const spriteTileFiles = await _scandirForFileType(path + "/sprites/tiles", ".png");
    const spriteUiFiles = await _scandirForFileType(path + "/sprites/ui", ".png");

    const entityFiles = await _scandirForFileType(path + "/entities", ".spr-ent");
    const tileFiles = await _scandirForFileType(path + "/entities", ".spr-til");

    const entityMetadata = [] as DataAssetMetadata<Entity>[];
    const tileMetadata = [] as DataAssetMetadata<Tile>[];

    for (const file of entityFiles) {
        const entityJson = _readTextFile(file.fullPath);
        entityMetadata.push({
            ...file,
            data: JSON.parse(entityJson),
        });
    }

    for (const file of tileFiles) {
        const tileJson = _readTextFile(file.fullPath);
        tileMetadata.push({
            ...file,
            data: JSON.parse(tileJson),
        });
    }

    return {
        type: 'resource_pack',
        fullPath: _path(path),
        relativePath: _path(Path.parse(path).dir),
        manifestPath: _path(path + "/manifest.sm-res"),
        manifest: manifest,
        backgrounds: backgroundFiles,
        entities: entityMetadata,
        music: musicFiles,
        sound: soundFiles,
        sprites: {
            entities: spriteEntityFiles,
            particles: spriteParticleFiles,
            tiles: spriteTileFiles,
            ui: spriteUiFiles,
        },
        tiles: tileMetadata,
    };
}

async function _scandirForFileType (path: string, ...extensions: string[]) {
    const results = (await fsAsync.readdir(path, {
        withFileTypes: true,
    }));

    const targetedFiles = [] as MediaAssetMetadata[];

    for (const res of results) {
        if (res.isDirectory()) continue;

        const file = Path.parse(res.name);

        if (extensions.includes(file.ext)) {
            targetedFiles.push({
                fileName: file.name,
                baseName: file.base,
                extension: file.ext,
                fullPath: _path(path + "/" + res.name),
            });
        }
    }

    return targetedFiles;
}

/**
 * Adjusts the path for the currenet operating system.
 * @param path The path to adjust.
 */
function _path (path: string) {
    return _winPath(path);
}

function _getWindowsPersonalFolder () : Promise<string> {
    return new Promise((resolve, reject) => {
        const regKey = new Registry({
            hive: Registry.HKCU,
            key: REGKEY_USER_FOLDER,
        });
    
        regKey.values((err, items) => {
            if (err) {
                reject(err);
            }

            for (const i in items) {
                if (items[i].name === "Personal") {
                    resolve(items[i].value);
                    return;
                }
            }
        });
    });
}

function _winPath (path: string) {
    return path.replaceAll("/", "\\");
}

function _readTextFile (path: string) {
    return fs.readFileSync(path, TEXT_FORMAT).replace(/^\uFEFF/, "");
}
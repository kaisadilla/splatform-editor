import fsAsync from "fs/promises";
import fs from "fs";
import Registry from "winreg";
import { DataAssetMetadata, MediaAssetMetadata, ResourcePack, ResourcePackManifest } from "models/ResourcePack";
import Path from "path";
import { Entity, EntityFile } from "models/Entity";
import { Tile, TileFile } from "models/Tile";
import { LOCALE, getWinPath } from "../main-utils";
import { app } from "electron";

const REGKEY_USER_FOLDER = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders';
const TEXT_FORMAT = "utf-8";

export async function getUserdataFolderPath () {
    let personalFolder = await _getWindowsPersonalFolder();

    if (personalFolder.includes("%USERPROFILE%")) {
        personalFolder = personalFolder.replaceAll("%USERPROFILE%", app.getPath('home'));
    }

    return personalFolder + "/My Games/SPlatform";
}

export async function getInstalledResourcePacks () {
    const start = Date.now();

    const personalFolder = await getUserdataFolderPath();
    const resPath = personalFolder + "/resource-packs";

    const resFolders = (await fsAsync.readdir(resPath, {
        withFileTypes: true,
    })).filter(e => e.isDirectory()).map(f => f.name);

    const resourcePackFolders = [];
    
    for (const f of resFolders) {
        const folderPath = resPath + "/" + f;
        const manifestPath = folderPath + "/manifest.sm-res";

        if (fs.existsSync(manifestPath)) {
            const pack = await _readResourcePackFolder(folderPath, f);
            resourcePackFolders.push(pack);
        }
    }

    const end = Date.now();
    console.info(`Resource folders read in ${end - start} ms.`);

    return resourcePackFolders;
}

async function _readResourcePackFolder (path: string, folderName: string)
    : Promise<ResourcePack>
{
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

    const entityFiles = await _scandirForFileType(path + "/data/entities", ".spr-ent");
    const tileFiles = await _scandirForFileType(path + "/data/tiles", ".spr-til");

    const entityMetadata = [] as DataAssetMetadata<Entity>[];
    const tileMetadata = [] as DataAssetMetadata<Tile>[];

    for (const file of entityFiles) {
        const entityJson = _readTextFile(file.fullPath);
        const entityFile = JSON.parse(entityJson) as EntityFile;
        const entity = {
            ...entityFile,
            id: file.id,
        };

        entityMetadata.push({
            ...file,
            data: entity,
        });
    }

    for (const file of tileFiles) {
        const tileJson = _readTextFile(file.fullPath);
        const tileFile = JSON.parse(tileJson) as TileFile;
        const tile = {
            ...tileFile,
            id: file.id,
        }

        tileMetadata.push({
            ...file,
            data: tile,
        });
    }

    return {
        type: 'resource_pack',
        folderName: folderName,
        fullPath: getWinPath(path),
        relativePath: getWinPath(Path.parse(path).dir),
        manifestPath: getWinPath(path + "/manifest.sm-res"),
        manifest: manifest,
        backgrounds: backgroundFiles,
        entities: entityMetadata.sort(
            (a, b) => a.data.name.localeCompare(b.data.name, LOCALE)
        ),
        music: musicFiles,
        sound: soundFiles,
        sprites: {
            entities: spriteEntityFiles,
            particles: spriteParticleFiles,
            tiles: spriteTileFiles,
            ui: spriteUiFiles,
        },
        tiles: tileMetadata.sort(
            (a, b) => a.data.name.localeCompare(b.data.name, LOCALE)
        ),
    } as ResourcePack;
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
                id: file.name,
                fileName: file.name,
                baseName: file.base,
                extension: file.ext,
                fullPath: getWinPath(path + "/" + res.name),
            });
        }
    }

    return targetedFiles;
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

function _readTextFile (path: string) {
    return fs.readFileSync(path, TEXT_FORMAT).replace(/^\uFEFF/, "");
}
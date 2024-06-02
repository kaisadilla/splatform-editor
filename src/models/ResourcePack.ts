import { Entity } from "./Entity";
import { Tile } from "./Tile";
import { Version } from "./sp_documents";

export interface ResourcePack {
    fullPath: string;
    relativePath: string;
    manifestPath: string;
    manifest: ResourcePackManifest;
    backgrounds: MediaAssetMetadata[];
    entities: DataAssetMetadata<Entity>[];
    music: MediaAssetMetadata[];
    sound: MediaAssetMetadata[];
    sprites: {
        entities: MediaAssetMetadata[];
        particles: MediaAssetMetadata[];
        tiles: MediaAssetMetadata[];
        ui: MediaAssetMetadata[];
    };
    tiles: DataAssetMetadata<Tile>[];
}

export interface ResourcePackManifest {
    name: string;
    version: Version;
    settings: ResourcePackManifestSettings;
}

export interface ResourcePackManifestSettings {
    
}

export interface MediaAssetMetadata {
    baseName: string;
    fileName: string;
    extension: string;
    fullPath: string;
}

export interface DataAssetMetadata<T> {
    baseName: string;
    fileName: string;
    extension: string;
    data: T;
}
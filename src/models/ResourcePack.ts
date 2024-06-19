import { Entity } from "./Entity";
import { Tile } from "./Tile";
import { TileComposite } from "./TileComposite";
import { Version } from "./sp_documents";

export interface ResourcePack {
    type: 'resource_pack';
    folderName: string;
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
    tileComposites: DataAssetMetadata<TileComposite>[];
    // calculated automatically
    entitiesById: {[key: string]: DataAssetMetadata<Entity>};
    tilesById: {[key: string]: DataAssetMetadata<Tile>};
    tileCompositesById: {[key: string]: DataAssetMetadata<TileComposite>};
}

export interface ResourcePackManifest {
    type: 'manifest';
    displayName: string;
    version: Version;
    settings: ResourcePackManifestSettings;
}

export interface ResourcePackManifestSettings {
    
}

export interface MediaAssetMetadata {
    id: string;
    baseName: string;
    fileName: string;
    extension: string;
    fullPath: string;
}

export interface DataAssetMetadata<T> {
    id: string;
    baseName: string;
    fileName: string;
    extension: string;
    data: T;
}

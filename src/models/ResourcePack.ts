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
    backgrounds: FileMetadata[];
    entities: DocumentMetadata<Entity>[];
    music: FileMetadata[];
    sound: FileMetadata[];
    sprites: {
        entities: FileMetadata[];
        particles: FileMetadata[];
        tiles: FileMetadata[];
        ui: FileMetadata[];
    };
    tiles: DocumentMetadata<Tile>[];
    tileComposites: DocumentMetadata<TileComposite>[];
    // calculated automatically
    entitiesById: {[key: string]: DocumentMetadata<Entity>};
    tilesById: {[key: string]: DocumentMetadata<Tile>};
    tileCompositesById: {[key: string]: DocumentMetadata<TileComposite>};
}

export interface ResourcePackManifest {
    type: 'resource_pack_manifest';
    displayName: string;
    version: Version;
    settings: ResourcePackManifestSettings;
}

export interface ResourcePackManifestSettings {
    
}

export interface FolderMetadata {
    id: string;
    name: string;
    fullPath: string;
}

export interface FileMetadata {
    id: string;
    baseName: string;
    fileName: string;
    extension: string;
    fullPath: string;
}

export interface DocumentMetadata<T> {
    id: string;
    baseName: string;
    fileName: string;
    extension: string;
    data: T;
}

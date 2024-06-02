import { SPDocumentType, Version } from "./sp_documents";

export interface Level {
    type: SPDocumentType;
    version: Version;
    settings: LevelSettings;
    layers: TileLayer[];
    spawns: EntitySpawn[];
    events: LevelEvent[];
}

export interface LevelSettings {
    width: number;
    height: number;
    background: string;
    music: string;
    time: number;
}

export interface TileLayer {
    name: string;
    settings: TileLayerSettings;
    tiles: LevelTile[];
}

export interface TileLayerSettings {
    checksCollisions?: boolean;
}

export interface LevelTile {
    position: [number, number];
    tile: string;
    behaviorProperties?: {[prop: string]: any};
}

export interface EntitySpawn {
    id?: number;
    position: [number, number];
    entity: string,
    behaviorProperties?: {[prop: string]: any};
}

export interface LevelEvent {
    // todo
}
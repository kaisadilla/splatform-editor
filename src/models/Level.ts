import { Vec2 } from "utils";
import { SPDocumentType, Version } from "./sp_documents";

export interface Level {
    type: 'level';
    resourcePack: string | null;
    displayName: string;
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
    position: Vec2;
    tile: string;
    behaviorProperties?: {[prop: string]: any};
}

export interface EntitySpawn {
    id?: number;
    position: Vec2;
    entity: string,
    behaviorProperties?: {[prop: string]: any};
}

export interface LevelEvent {
    // todo
}

export function getNewLevel () : Level {
    return {
        type: 'level',
        resourcePack: null,
        displayName: "New level",
        version: {
            major: 1,
            minor: 1,
            revision: 1,
        },
        settings: {
            width: 128,
            height: 32,
            background: 'default_0',
            music: 'overworld',
            time: 300,
        },
        layers: [
            {
                name: "Main",
                settings: {
                    checksCollisions: true,
                },
                tiles: []
            },
        ],
        spawns: [],
        events: [],
    };
}
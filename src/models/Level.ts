import { Vec2 } from "utils";
import { SPDocumentType, Version } from "./sp_documents";
import { TileTraitId, TraitId, TraitParameterCollection } from "data/TileTraits";
import { Tile } from "./Tile";
import { TraitValueCollection } from "./splatform";

export interface Level {
    type: 'level';
    resourcePack: string | null;
    displayName: string;
    version: Version;
    settings: LevelSettings;
    layers: TileLayer[];
    spawns: LevelSpawn[];
    events: LevelEvent[];
}

export interface LevelSettings {
    width: number;
    height: number;
    background: string;
    music: string;
    time: number;
}

/**
 * Represents a layer of tiles in a level.
 */
export interface TileLayer {
    name: string;
    settings: TileLayerSettings;
    tiles: PlacedTile[];
}

export interface TileLayerSettings {
    checksCollisions?: boolean;
}

/**
 * Represents a tile in a level.
 */
export interface LevelTile {
    tile: string;
    parameters: TraitValueCollection<TileTraitId>;
}

/**
 * Represents a tile in a level that has a predetermined position in said level.
 */
export interface PlacedTile extends LevelTile {
    position: Vec2;
}

/**
 * Represents an entity in a level.
 */
export interface LevelEntity {
    behavior: string,
    behaviorProperties: {[prop: string]: any};
}

/**
 * Represents a spawn point in a level.
 */
export interface LevelSpawn {
    position: Vec2;
    entity: LevelEntity;
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
            height: 16,
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

export function getNewLevelTile (tile: Tile) : LevelTile {
    const params: TraitValueCollection = {};

    for (const trait of tile.traits) {
        params[trait.id] = {} as {[key: string]: any};

        for (const configParam of trait.configurableParameters) {
            const defaultValue = trait.parameters[configParam];
            //@ts-ignore TODO: Better types for traits.
            params[trait.id]![configParam] = defaultValue;
        }
    }
    
    return {
        tile: tile.id,
        parameters: params,
    };
}

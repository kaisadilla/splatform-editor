import { Vec2 } from "utils";
import { SPDocumentType, Version } from "./sp_documents";
import { EntityTraitId, TileTraitId, TraitId, TraitParameterCollection } from "data/TileTraits";
import { Tile } from "./Tile";
import { ParameterValueCollection, TraitValueCollection } from "./splatform";
import { Entity } from "./Entity";

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
    tileId: string;
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
    entityId: string,
    parameters: TraitValueCollection<EntityTraitId>;
    /**
     * The horizontal direction at which the entity will initially be looking at.
     * This direction may be changed by some traits.
     */
    orientation: 'right' | 'left';
}

/**
 * Represents a spawn point in a level.
 */
export interface LevelSpawn {
    uuid: string;
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
    const params: TraitValueCollection<TileTraitId> = {};

    for (const trait of tile.traits) {
        params[trait.id] = {} as ParameterValueCollection;

        if (trait.configurableParameters === undefined) continue;

        for (const configParam of trait.configurableParameters) {
            const defaultValue = trait.parameters[configParam];
            params[trait.id]![configParam] = defaultValue;
        }
    }
    
    return {
        tileId: tile.id,
        parameters: params,
    };
}

export function getNewLevelEntity (entity: Entity) : LevelEntity {
    const params: TraitValueCollection<EntityTraitId> = {};

    for (const trait of entity.traits) {
        // @ts-ignore TODO: Remove this ignore
        params[trait.id] = {} as ParameterValueCollection;

        if (trait.configurableParameters === undefined) continue;

        for (const configParam of trait.configurableParameters) {
            const defaultValue = trait.parameters[configParam];
            // @ts-ignore TODO: Remove this ignore
            params[trait.id]![configParam] = defaultValue;
        }
    }

    return {
        entityId: entity.id,
        orientation: 'left',
        parameters: params,
    }
}
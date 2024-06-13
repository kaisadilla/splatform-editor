import { Vec2 } from "utils";
import { SPDocumentType, Version } from "./sp_documents";
import { Tile } from "./Tile";
import { ParameterValueCollection, TraitValueCollection } from "./splatform";
import { Entity } from "./Entity";
import { EntityTraitId, TileTraitId } from "data/Traits";
import { EntityTraitCollection } from "data/EntityTraits";

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
                name: "Background",
                settings: {
                    checksCollisions: false,
                },
                tiles: []
            },
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
        if (trait.configurableParameters === undefined) continue;
        if (trait.configurableParameters.length === 0) continue;

        params[trait.id as TileTraitId] = {} as ParameterValueCollection;

        for (const configParam of trait.configurableParameters) {
            const defaultValue = trait.parameters[configParam];
            params[trait.id as TileTraitId]![configParam] = defaultValue;
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
        if (trait.configurableParameters === undefined) continue;
        if (trait.configurableParameters.length === 0) continue;

        params[trait.id as EntityTraitId] = {} as ParameterValueCollection;

        for (const configParam of trait.configurableParameters) {
            const defaultValue = trait.parameters[configParam];
            params[trait.id as EntityTraitId]![configParam] = defaultValue;
        }
    }

    return {
        entityId: entity.id,
        orientation: 'left',
        parameters: params,
    }
}
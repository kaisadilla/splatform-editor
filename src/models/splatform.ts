import { TraitId } from "data/Traits";
import { LevelEntity, LevelTile } from "./Level";

/**
 * The type of value a parameter in SPlatform can hold.
 */
export type ParameterType =
    'boolean'
    | 'integer'
    | 'float'
    | 'string'
    | 'tileReference'
    | 'entityReference'
    | 'tileOrEntityReference'
    | 'direction'
    | 'playerDamageType'
    | 'powerUpType'
    | 'rewardType'
    | 'blockRegenerationMode'
    | 'entityDamageType'

/**
 * An SPlatform trait. Contains the data that describes how a trait works.
 * 
 * **This is the object used by SPlatform.Editor to describe how a trait, such
 * as "breakable", works in the SPlatform client.**
 */
export interface Trait<T> {
    id: string;
    displayName: string;
    description?: string;
    parameters: T;
}

/**
 * An SPlatform parameter. Contains the data that describes how a parameter works.
 * 
 * **This is the object used by SPlatform.Editor to describe how a parameter,
 * such as the parameter "isHidden" in the trait "breakable", works in the
 * SPlatform client.**
 */
export interface Parameter<T> {
    id: string;
    displayName: string;
    description?: string;
    nullable: boolean;
    type: ParameterType;
    defaultValue: T;
    validValues?: T[];
}

/**
 * Represents the specification of a given trait for an object in the
 * resource pack, such as a tile or entity. Contains the name of a trait, the
 * values for that trait's parameters, and a list of parameters that can be
 * further configured for each individual level tile.
 * 
 * **This is the object used by .spr-til and .spr-ent files to specify traits.**
 * 
 * T is a type that enumerates possible trait ids, such as `TileTraitId` or
 * `EntityTraitId`.
 */
export interface TraitSpecification<T extends TraitId> {
    id: T;
    parameters: ParameterValueCollection;
    configurableParameters: string[];
    stateAnimations?: {[key: string]: string};
}

/**
 * Holds information about a collection of traits a level item has, and the values
 * assigned to each of its parameters. Each key is the name of a trait, and each
 * value is an object where each key is the name of one parameter for that trait,
 * and each value is the value assigned to that parameter.
 * 
 * **This is the object used by LevelTiles and LevelEntities to specify the
 * parameter values that apply to that specific world object.**
 */
export type TraitValueCollection<T extends TraitId> = {
    [key in T]?: ParameterValueCollection;
};

/**
 * A preset that applies values to a trait.
 * 
 * **This is the object used by .spr-til and .spr-ent files to specify preset
 * values for traits.**
 */
export interface TraitPreset {
    name: string;
    parameters: {[key: string]: any};
}

/**
 * Holds specific values assigned to a set of parameters. Each key is the name
 * of a parameter and each value is that parameter's value.
 * 
 * **This is the object used by LevelTiles and LevelEntities to specify the
 * parameter values that apply to a specific trait for that specific level
 * object. This is also the object used by Entities and Tiles to specify the
 * default values for their parameters.**
 * 
 * In general, this object should be used to store values for parameters for
 * a give ntrait.
 */
export interface ParameterValueCollection {
    [key: string]: any;
}

export const PlayerDamageTypeValues = ["regular", "fatal"] as const;
export type PlayerDamageType = typeof PlayerDamageTypeValues[number];

export const EntityDamageTypeValues = ["none", "regular", "fatal"] as const;
export type EntityDamageType = typeof EntityDamageTypeValues[number];

export const RewardTypeValues = ["coin", "item"] as const;
export type RewardType = typeof RewardTypeValues[number];

export const BlockRegenerationModeValues = ["time", "offscreen"] as const;
export type BlockRegenerationMode = typeof BlockRegenerationModeValues[number];

export const ItemReferenceTypeValues = ["tile", "entity"] as const;
export const ItemReferenceTypeValueArr = ItemReferenceTypeValues as ReadonlyArray<string>;
export type ItemReferenceType = typeof ItemReferenceTypeValues[number];

export type LevelObject = LevelTile | LevelEntity;

interface ReferenceBase<T extends LevelObject> {
    object: T;
}

export interface TileReference extends ReferenceBase<LevelTile> {
    type: 'tile';
}

export interface EntityReference extends ReferenceBase<LevelEntity> {
    type: 'entity';
}

/**
 * Represents a level object in the game, such as a specific entity or tile.
 */
export type Reference = TileReference | EntityReference;

/**
 * Defines how a spritesheet works. Used by tiles, entities, etc to define their
 * sprites.
 */
export interface SpritesheetSpecification {
    /**
     * The name of the sprite, located in the /sprites/entities/ folder.
     */
    name: string;
    /**
     * The size, in pixels, of each slice in the spritesheet.
     */
    sliceSize: [number, number];
    /**
     * The amount of slices in each row and in each column.
     */
    slices: [number, number];
}

export interface DimensionsSpecification {
    /**
     * the dimensions of the entity, in pixels. If this value is the same
     * as `spritesheet.sliceSize`, then the sprite will be pixel-perfect. 
     */
    sprite: [number, number];
    /**
     * a rect describing the position of the collider in relation to the
     * dimensions of the entity.
     */
    collider: [number, number, number, number];
}

export interface ObjectAnimation {
    type: 'static' | 'dynamic';
    slices?: [number, number];
    frame?: number;
    frames?: number[];
    frameTimes?: number | number[];
}

export type Direction = 'up' | 'down' | 'left' | 'right';
export type PowerUpType =
    'strong'
    | 'fireball'
    | 'frog'
    | 'hammer'
    | 'leaf'
    | 'superball'
    | 'tanooki'
;
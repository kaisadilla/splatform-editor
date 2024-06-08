import { TileTraitId } from "data/TileTraits";

export interface Tile {
    type: 'tile';
    name: string;
    category: string | null;
    traits: TileTraitDefinition[];
    presets?: TileTraitPreset[];
    spritesheet: string;
    animation: {
        type: 'static' | 'dynamic';
        slices?: [number, number];
        frame?: number;
        frames?: number[];
        frameTimes?: number | number[];
    }
}

export interface TileTraitDefinition {
    name: TileTraitId;
    parameters: {[key: string]: any};
    configurableParameters: string[];
}

export interface TileTraitPreset {
    name: string;
    parameters: {[key: string]: any};
}

export function getNewTile () : Tile {
    return {
        type: 'tile',
        name: "New tile",
        category: null,
        traits: [],
        spritesheet: "block_empty",
        animation: {
            type: "static",
        },
    }
}
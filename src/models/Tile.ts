import { TileTraitId } from "data/TileTraits";
import { TraitSpecification, TraitPreset } from "./splatform";

export interface Tile extends TileFile {
    id: string;
}

export type TileFile = {
    type: 'tile';
    name: string;
    category: string | null;
    traits: TraitSpecification<TileTraitId>[];
    presets?: TraitPreset[];
    spritesheet: string;
    animation: {
        type: 'static' | 'dynamic';
        slices?: [number, number];
        frame?: number;
        frames?: number[];
        frameTimes?: number | number[];
    }
}

export function getNewTile () : TileFile {
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
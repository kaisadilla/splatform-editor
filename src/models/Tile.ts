import { TileTraitId } from "data/TileTraits";
import { TraitSpecification, TraitPreset, ObjectAnimation } from "./splatform";

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
    animation: ObjectAnimation;
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
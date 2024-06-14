import { TileTraitId } from "data/Traits";
import { TraitSpecification, TraitPreset, ObjectAnimation, SpritesheetSpecification } from "./splatform";

export interface Tile extends TileFile {
    id: string;
}

export type TileFile = {
    type: 'tile';
    name: string;
    category: string | null;
    traits: TraitSpecification<TileTraitId>[];
    presets?: TraitPreset[];
    spritesheet: SpritesheetSpecification;
    animations: {
        default: ObjectAnimation,
        [key: string]: ObjectAnimation
    }
}

export function getNewTile () : TileFile {
    return {
        type: 'tile',
        name: "New tile",
        category: null,
        traits: [],
        spritesheet: {
            name:  "block_empty"
        },
        animations: {
            default: {
                type: "static",
            }
        },
    }
}
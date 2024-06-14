import { EntityTraitId } from "data/Traits";
import { Version } from "./sp_documents";
import { DimensionsSpecification, ObjectAnimation, SpritesheetSpecification, TraitSpecification } from "./splatform";

export interface Entity extends EntityFile {
    id: string
}

export interface EntityFile {
    type: 'entity';
    subtype: 'enemy' | 'item';
    category: string | null;
    name: string;
    collidesWithTiles: boolean;
    collidesWithPlayers: boolean;
    collidesWithEntities: boolean;
    gravityScale: number;
    traits: TraitSpecification<EntityTraitId>[];
    spritesheet: SpritesheetSpecification;
    dimensions: DimensionsSpecification;
    animations: {
        default: ObjectAnimation,
        [key: string]: ObjectAnimation
    }
}

export function getNewEntity () : EntityFile {
    return {
        type: 'entity',
        subtype: 'enemy',
        category: null,
        name: "New entity",
        collidesWithTiles: true,
        collidesWithPlayers: true,
        collidesWithEntities: true,
        gravityScale: 1,
        traits: [],
        spritesheet: {
            name: "goomba_brown",
            sliceSize: [16, 16],
            slices: [3, 1],
        },
        dimensions: {
            sprite: [16, 16],
            collider: [0, 0, 16, 16],
        },
        animations: {
            default: {
                type: "static",
            }
        },
    };
}

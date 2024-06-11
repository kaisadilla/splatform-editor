import { Version } from "./sp_documents";

export interface Entity extends EntityFile {
    id: string
}

export interface EntityFile {
    type: 'entity';
    subtype: 'enemy' | 'item' | 'entity-platform';
    name: string;
    behavior: string;
    behaviorProperties: {[prop: string]: any};
    configurableProperties: string[];
    sprite: string;
    dimensions: {
        sprite: [number, number];
        collider: [number, number, number, number];
    };
}

export function getNewEntity () : EntityFile {
    return {
        type: 'entity',
        subtype: 'enemy',
        name: "New entity",
        behavior: "goomba",
        behaviorProperties: {
            avoidsCliffs: true,
            startingDirectionRight: true,
        },
        configurableProperties: [
            "startingDirectionRight",
        ],
        sprite: "goomba",
        dimensions: {
            sprite: [16, 16],
            collider: [0, 0, 16, 16],
        },
    }
}

export interface Tile {
    type: 'tile';
    name: string;
    behavior: string;
    behaviorProperties: {[prop: string]: any};
    configurableProperties: string[];
    sprite: string;
    animation: {
        type: string;
        slices: [number, number];
        frame?: number;
        frames?: number[];
        frameTimes?: number | number[];
    };
}

export function getNewTile () : Tile {
    return {
        type: 'tile',
        name: "New tile",
        behavior: "tile",
        behaviorProperties: {},
        configurableProperties: [],
        sprite: "block_empty",
        animation: {
            type: "static",
            slices: [1, 1],
            frame: 0
        }
    }
}

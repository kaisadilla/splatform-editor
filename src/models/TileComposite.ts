import { WithId } from "./sp_documents";

export type TileCompositeType = 'rectangle' | 'shapeless';

export interface TileCompositeFile {
    type: 'tile_composite',
    name: string;
    compositeType: TileCompositeType;
    minSize: [number, number];
}

export interface RectangleTileCompositeFile extends TileCompositeFile {
    compositeType: 'rectangle';
    tiles: {
        topLeft: string;
        top: string;
        topRight: string;
        left: string;
        center: string;
        right: string;
        bottomLeft: string;
        bottom: string;
        bottomRight: string;
    };
}

export type TileComposite = WithId<TileCompositeFile>;
export type RectangleTileComposite = WithId<RectangleTileCompositeFile>;
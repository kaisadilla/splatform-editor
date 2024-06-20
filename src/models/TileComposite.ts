import { WithId } from "./sp_documents";

export type TileCompositeType = 'free_form' | 'rectangle' | 'line' | 'unit';

export interface TileCompositeFile {
    type: 'tile_composite',
    name: string;
    compositeType: TileCompositeType;
    thumbnailTile: string;
}

export interface RectangleTileCompositeFile extends TileCompositeFile {
    compositeType: 'rectangle';
    tiles: TileShape;
    minSize: [number, number];
}

export interface LineTileCompositeFile extends TileCompositeFile {
    lines: {[key: string]: TileShape};
    thickness: number;
    minLength: number;
}

export interface UnitTileCompositeFile extends TileCompositeFile {
    shape: (string | null)[][];
}

export interface TileShape {
    default: string;
    topLeft?: string;
    top?: string;
    topRight?: string;
    left?: string;
    center?: string;
    right?: string;
    bottomLeft?: string;
    bottom?: string;
    bottomRight?: string;
} 

export type TileComposite = WithId<TileCompositeFile>;
export type RectangleTileComposite = WithId<RectangleTileCompositeFile>;
export type LineTileComposite = WithId<LineTileCompositeFile>;
export type UnitTileComposite = WithId<UnitTileCompositeFile>;
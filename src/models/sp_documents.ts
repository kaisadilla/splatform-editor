import { ResourcePack, ResourcePackManifest } from "./ResourcePack";
import { Entity, EntityFile } from "./Entity";
import { Tile, TileFile } from "./Tile";
import { World } from "./World";
import { Game } from "./Game";
import { Level } from "./Level";
import { TileComposite } from "./TileComposite";

export type SPDocumentType =
    'level'
    | 'world'
    | 'game'
    | 'resource_pack'
    | 'manifest'
    | 'entity'
    | 'tile'
;

export type SPDocumentContent =
    Level
    | World
    | Game
    | ResourcePack
    | ResourcePackManifest
    | EntityFile
    | TileFile
;

export interface SPDocument {
    id: string;
    baseName?: string;
    fileName?: string;
    fullPath?: string;
    hasUnsavedChanges: boolean;
    content: SPDocumentContent;
};

export type SPBinaryType =
    'level'
    | 'game'
;

export interface Version {
    major: number;
    minor: number;
    revision: number;
}

export type TilePaint = Tile | TileComposite;

export type WithId<T> = T & { id: string };

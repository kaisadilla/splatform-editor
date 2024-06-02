import { ResourcePack, ResourcePackManifest } from "./ResourcePack";
import { Entity } from "./Entity";
import { Tile } from "./Tile";
import { World } from "./World";
import { Game } from "./Game";
import { Level } from "./Level";

export type SPDocumentType =
    'level'
    | 'world'
    | 'game'
    | 'resource_pack'
    | 'manifest'
    | 'entity'
    | 'tile';

export type SPDocumentContent =
    Level
    | World
    | Game
    | ResourcePack
    | ResourcePackManifest
    | Entity
    | Tile;

export interface SPDocument {
    id: string;
    fileName?: string;
    fullPath?: string;
    content: SPDocumentContent;
};

export interface Version {
    major: number;
    minor: number;
    revision: number;
}
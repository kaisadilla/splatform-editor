import { EntityFile } from "./Entity";
import { Level } from "./Level";
import { Project, ProjectManifest } from "./Project";
import { ResourcePack, ResourcePackManifest } from "./ResourcePack";
import { Tile, TileFile } from "./Tile";
import { TileComposite } from "./TileComposite";
import { World } from "./World";

export type SPDocumentType =
    'level'
    | 'world'
    | 'project'
    | 'project_manifest'
    | 'resource_pack'
    | 'resource_pack_manifest'
    | 'entity'
    | 'tile'
;

export type SPDocumentContent =
    Level
    | World
    | Project
    | ProjectManifest
    | ResourcePack
    | ResourcePackManifest
    | EntityFile
    | TileFile
;

export type SPFolderContent = Project | ResourcePack;

export interface SPDocument {
    id: string;
    displayName?: string;
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

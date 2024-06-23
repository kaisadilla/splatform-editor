import { FolderMetadata, FileMetadata } from "./ResourcePack";
import { Version } from "./sp_documents";

export type ProjectContentType = 'worlds' | 'levels';

export interface Project {
    type: 'project';
    folderName: string;
    fullPath: string;
    manifestPath: string;
    manifest: ProjectManifest;
    levels: ProjectFolder;
    worlds: ProjectFolder;
}

export interface ProjectFolder {
    meta: FolderMetadata;
    files: FileMetadata[];
    folders: ProjectFolder[];
}

export interface ProjectManifest {
    type: 'project_manifest';
    displayName: string;
    version: Version;
    resourcePack: string | null;
    contentType: ProjectContentType;
}

export function getNewProjectManifest (name: string, pack: string)
    : ProjectManifest
{
    return {
        type: 'project_manifest',
        displayName: name,
        version: {
            major: 1,
            minor: 1,
            revision: 1,
        },
        resourcePack: pack,
        contentType: 'worlds',
    };
}

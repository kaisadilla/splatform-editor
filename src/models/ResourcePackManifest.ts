import { Version } from "./sp_documents";

export interface ResourcePackManifest {
    name: string;
    version: Version;
    settings: ResourcePackManifestSettings;
}

export interface ResourcePackManifestSettings {
    
}
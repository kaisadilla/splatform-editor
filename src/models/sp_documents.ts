export type SPDocumentType =
    'level'
    | 'world'
    | 'game' 
    | 'resource_pack'
    | 'entity'
    | 'tile';

export interface Version {
    major: number;
    minor: number;
    revision: number;
}
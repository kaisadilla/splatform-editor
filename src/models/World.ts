import { Version } from "./sp_documents";

export interface World {
    type: 'world';
    displayName: string;
    version: Version;
}

export function getNewWorld () : World {
    return {
        type: 'world',
        displayName: "New world",
        version: {
            major: 1,
            minor: 1,
            revision: 1,
        },
    };
}

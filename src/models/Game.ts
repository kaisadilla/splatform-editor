import { Version } from "./sp_documents";

export interface Game {
    type: 'game';
    displayName: string;
    version: Version;
}

export function getNewGame () : Game {
    return {
        type: 'game',
        displayName: "New game",
        version: {
            major: 1,
            minor: 1,
            revision: 1,
        },
    };
}

import Ipc from "main/ipc/ipcRenderer";
import { getNewEntity } from "models/Entity";
import { getNewGame } from "models/Game";
import { getNewLevel } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { getNewTile } from "models/Tile";
import { getNewWorld } from "models/World";
import { SPDocument, SPDocumentContent } from "models/sp_documents";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface UserContextState {
    openDocuments: SPDocument[];
    createNewLevel: () => SPDocument;
    createNewWorld: () => SPDocument;
    createNewGame: () => SPDocument;
    createNewEntity: () => SPDocument;
    createNewTile: () => SPDocument;
}

const UserContext = createContext<UserContextState>({} as UserContextState);
const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }: any) => {
    const [state, setState] = useState<UserContextState>({
        openDocuments: [] as SPDocument[],
    } as UserContextState);
    const [internal, setInternal] = useState({
        nextDocumentIndex: 1,
    })

    const value = useMemo(() => {
        function createNewLevel () : SPDocument {
            const level = getNewLevel();
            return createNewDocument(level);
        }
        function createNewWorld () : SPDocument {
            const world = getNewWorld();
            return createNewDocument(world);
        }
        function createNewGame () : SPDocument {
            const game = getNewGame();
            return createNewDocument(game);
        }
        function createNewEntity () : SPDocument {
            const entity = getNewEntity();
            return createNewDocument(entity);
        }
        function createNewTile () : SPDocument {
            const tile = getNewTile();
            return createNewDocument(tile);
        }

        return {
            ...state,
            createNewLevel,
            createNewWorld,
            createNewGame,
            createNewEntity,
            createNewTile,
        };
    }, [state]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
    
    function createNewDocument (content: SPDocumentContent) : SPDocument {
        const docIndex = getNextDocumentIndex();
        const doc: SPDocument = {
            id: `Untitled ${docIndex}`,
            content: content,
        };

        setState(prevState => ({
            ...prevState,
            openDocuments: [
                ...prevState.openDocuments,
                doc,
            ]
        }));

        return doc;
    }

    function getNextDocumentIndex () : number {
        const index = internal.nextDocumentIndex;

        setInternal(prevState => ({
            ...prevState,
            nextDocumentIndex: index + 1,
        }))

        return index;
    }
}

export {
    useUserContext,
    UserContextProvider,
};
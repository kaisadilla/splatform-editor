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
    activeTab: string | null;
    getActiveDocument: () => SPDocument;
    setActiveTab: (id: string) => void;
    createNewLevel: () => SPDocument;
    createNewWorld: () => SPDocument;
    createNewGame: () => SPDocument;
    createNewEntity: () => SPDocument;
    createNewTile: () => SPDocument;
    saveDocumentCopy: (doc: SPDocument) => Promise<string | null>;
}

const UserContext = createContext<UserContextState>({} as UserContextState);
const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }: any) => {
    const [state, setState] = useState<UserContextState>({
        openDocuments: [] as SPDocument[],
        activeTab: null,
    } as UserContextState);
    const [internal, setInternal] = useState({
        nextDocumentIndex: 1,
    })

    const value = useMemo(() => {
        /**
         * Returns the document in the tab that is currently active.
         */
        function getActiveDocument () : SPDocument {
            return state.openDocuments.find(d => d.id === state.activeTab)
                ?? {} as SPDocument;
        }

        /**
         * Sets which tab is currently active.
         * @param id The id of the document contained by that tab.
         */
        function setActiveTab (id: string) {
            setState(prevState => ({
                ...prevState,
                activeTab: id,
            }))
        }

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
        async function saveDocumentCopy (doc: SPDocument) {
            const path = await saveNewDocument(doc);
            return path;
        }

        return {
            ...state,
            getActiveDocument,
            setActiveTab,
            createNewLevel,
            createNewWorld,
            createNewGame,
            createNewEntity,
            createNewTile,
            saveDocumentCopy,
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
            hasUnsavedChanges: true,
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

    async function saveNewDocument (document: SPDocument) : Promise<string | null> {
        let path = null as string | null;
        const json = JSON.stringify(document.content, null, 4);
        if (document.content.type == 'level') {
            path = await Ipc.saveNewTextFile("Save level", json, [
                {
                    name: "SPlatform level",
                    extensions: ["sp-lev", "json"]
                }
            ])
        }
        else if (document.content.type == 'world') {
            path = await Ipc.saveNewTextFile("Save world", json, [
                {
                    name: "SPlatform world",
                    extensions: ["sp-wld", "json"]
                }
            ])
        }
        else if (document.content.type == 'game') {
            path = await Ipc.saveNewTextFile("Save game", json, [
                {
                    name: "SPlatform game",
                    extensions: ["sp-gme", "json"]
                }
            ])
        }
        else if (document.content.type == 'entity') {
            path = await Ipc.saveNewTextFile("Save entity", json, [
                {
                    name: "SPlatform entity",
                    extensions: ["spr-ent", "json"]
                }
            ])
        }
        else if (document.content.type == 'tile') {
            path = await Ipc.saveNewTextFile("Save tile", json, [
                {
                    name: "SPlatform tile",
                    extensions: ["spr-til", "json"]
                }
            ])
        }

        return path;
    }
}

export {
    useUserContext,
    UserContextProvider,
};
import { FileInfo } from "main/files/documentFiles";
import Ipc from "main/ipc/ipcRenderer";
import { getNewEntity } from "models/Entity";
import { getNewGame } from "models/Game";
import { getNewLevel } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { getNewTile } from "models/Tile";
import { getNewWorld } from "models/World";
import { SPDocument, SPDocumentContent, SPDocumentType } from "models/sp_documents";
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
    openDocument: () => Promise<SPDocument | null>;
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
            return _createNewDocument(level);
        }
        function createNewWorld () : SPDocument {
            const world = getNewWorld();
            return _createNewDocument(world);
        }
        function createNewGame () : SPDocument {
            const game = getNewGame();
            return _createNewDocument(game);
        }
        function createNewEntity () : SPDocument {
            const entity = getNewEntity();
            return _createNewDocument(entity);
        }
        function createNewTile () : SPDocument {
            const tile = getNewTile();
            return _createNewDocument(tile);
        }

        async function openDocument (type: SPDocumentType | null = null)
            : Promise<SPDocument | null>
        {
            const doc = await _openDocument(type);

            if (doc) {
                // try to find the newly opened document within the array of
                // documents that are already opened.
                const currentDoc = state.openDocuments.find(d => d.fullPath === doc.fullPath);
                // This file is already opened in the editor. We just make that
                // tab active, but discard the loaded file.
                if (currentDoc) {
                    console.info(
                        `Tried to load file '${doc.fullPath}, which is already loaded.'`
                    );
                    setState(prevState => ({
                        ...prevState,
                        activeTab: doc.id,
                    }));
                    return null;
                }
                else {
                    setState(prevState => ({
                        ...prevState,
                        openDocuments: [
                            ...prevState.openDocuments,
                            doc,
                        ],
                        activeTab: doc.id,
                    }));
                }
            }
            
            return doc;
        }

        async function saveDocumentCopy (doc: SPDocument) {
            const path = await _saveNewDocument(doc);
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
            openDocument,
            saveDocumentCopy,
        };
    }, [state]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
    
    function _createNewDocument (content: SPDocumentContent) : SPDocument {
        const docIndex = _getNextDocumentIndex();
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
            ],
            activeTab: doc.id,
        }));

        return doc;
    }

    function _getNextDocumentIndex () : number {
        const index = internal.nextDocumentIndex;

        setInternal(prevState => ({
            ...prevState,
            nextDocumentIndex: index + 1,
        }))

        return index;
    }

    async function _openDocument (type: SPDocumentType | null = null)
        : Promise<SPDocument | null>
    {
        let fileInfo: FileInfo<string> | null = null;

        fileInfo = await Ipc.openTextFile("Open level", [
            {
                name: "SPlatform file",
                extensions: [
                    "sp-lev", "sp-wld", "sp-gme", "sp-res",
                    "spr-ent", "spr-til", "spr-tco", "spr-tbr",
                    "json"
                ],
            },
            {
                name: "SPlatform level",
                extensions: [
                    "sp-lev"
                ],
            },
            {
                name: "SPlatform world",
                extensions: [
                    "sp-wld"
                ],
            },
            {
                name: "SPlatform game",
                extensions: [
                    "sp-gme"
                ],
            },
            {
                name: "SPlatform resource pack's manifest",
                extensions: [
                    "sp-res"
                ],
            },
            {
                name: "SPlatform entity",
                extensions: [
                    "spr-ent"
                ],
            },
            {
                name: "SPlatform tile",
                extensions: [
                    "spr-til"
                ],
            },
            {
                name: "SPlatform tile construct",
                extensions: [
                    "spr-tco"
                ],
            },
            {
                name: "SPlatform tile brush",
                extensions: [
                    "spr-tbr"
                ],
            },
            {
                name: "JSON file",
                extensions: [
                    "json"
                ],
            },
            {
                name: "All files",
                extensions: [
                    "*"
                ],
            },
        ]);

        if (fileInfo === null) return null;

        const doc: SPDocumentContent = JSON.parse(fileInfo.content);

        return {
            id: fileInfo.fullPath,
            fileName: fileInfo.fileName,
            fullPath: fileInfo.fullPath,
            content: doc,
            hasUnsavedChanges: false,
        };
    }

    async function _saveNewDocument (document: SPDocument) : Promise<string | null> {
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
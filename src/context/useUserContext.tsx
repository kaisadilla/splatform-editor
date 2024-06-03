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
import { deleteArrayItemAt } from "utils";

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
    closeDocument: (id: string) => Promise<boolean>;
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
            return doc;
        }

        async function closeDocument (id: string) {
            return await _promptCloseDocument(id);
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
            closeDocument,
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

        const docContent: SPDocumentContent = JSON.parse(fileInfo.content);

        if (!docContent) return null;
        
        const doc: SPDocument = {
            id: fileInfo.fullPath,
            baseName: fileInfo.baseName,
            fileName: fileInfo.fileName,
            fullPath: fileInfo.fullPath,
            content: docContent,
            hasUnsavedChanges: false,
        };
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

        return doc;
    }

    /**
     * Shows a dialog to the user asking them to confirm or reject closing the
     * document with the id given. If the user confirms their choice, the
     * document will be closed and, if needed, a new active tab will be chosen.
     * @param id The id of the document to close.
     * @returns `true` if the user closed the document, `false` otherwise.
     */
    async function _promptCloseDocument (id: string) : Promise<boolean> {
        const document = _getDocumentById(id);

        if (document === null) return false;

        if (document.hasUnsavedChanges === false) {
            _removeOpenDocument(document);
            return true;
        }

        const json = JSON.stringify(document.content, null, 4);

        const closed = await Ipc.closeDocument(
            document.content.type, document.fullPath ?? null, json
        );
        
        if (closed) {
            _removeOpenDocument(document);
        }

        return closed;
    }

    async function _saveNewDocument (document: SPDocument) : Promise<string | null> {
        let path = null as string | null;
        const json = JSON.stringify(document.content, null, 4);

        path = await Ipc.saveNewDocument(document.content.type, json);

        return path;
    }

    /**
     * Removes the document given from the array of opened documents in the app.
     * If the given document was the active one, selects the document immediately
     * before it as the new active document.
     * @param document The document to remove.
     */
    function _removeOpenDocument (document: SPDocument) {
        let index = state.openDocuments.findIndex(d => d.id === document.id);
        if (index < 0) return;

        const newArr = [...state.openDocuments];
        deleteArrayItemAt(newArr, index);
        
        index = Math.max(index - 1, 0);
        // if the document we are closing is the active document
        const newActiveTab = document.id === state.activeTab
            ? newArr[index].id // select a new active document
            : state.activeTab; // else don't select anything new

        // using setTimeout to launch this in the next frame guarantees that
        // activeTab won't get overriden even if the click that closed the tab
        // also selected it in the same moment. This can happen, for example,
        // if the close button on a tab doesn't prevent the tab from being selected.
        setTimeout(
            () => setState(prevState => ({
                ...prevState,
                openDocuments: newArr,
                activeTab: newActiveTab,
            })),
            0
        );
    }

    /**
     * Returns the document that matches the given id, if it exists, or null
     * if it doesn't.
     * @param id The id to try to find.
     */
    function _getDocumentById (id: string) : SPDocument | null {
        return state.openDocuments.find(d => d.id === id) ?? null;
    }
}

export {
    useUserContext,
    UserContextProvider,
};
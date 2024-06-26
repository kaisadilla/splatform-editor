import { FileInfo } from "main/files/documentFiles";
import Ipc from "main/ipc/ipcRenderer";
import { getNewEntity } from "models/Entity";
import { Project, getNewProjectManifest } from "models/Project";
import { getNewLevel } from "models/Level";
import { getNewTile } from "models/Tile";
import { getNewWorld } from "models/World";
import { SPBinaryType, SPDocument, SPDocumentContent, SPDocumentType, SPFolderContent } from "models/sp_documents";
import { createContext, useContext, useMemo, useState } from "react";
import { deleteArrayItemAt } from "utils";

interface UserContextState {
    documents: SPDocument[];
    activeTab: string | null;
    getActiveDocument: () => SPDocument;
    setActiveTab: (id: string) => void;
    updateDocument: (docId: string, content: SPDocumentContent) => void;
    createNewProject: (
        directory: string,
        folderName: string,
        displayName: string,
        resourcePack: string
    ) => Promise<SPDocument | null>;
    createNewLevel: () => SPDocument;
    createNewWorld: () => SPDocument;
    createNewGame: () => SPDocument;
    createNewEntity: () => SPDocument;
    createNewTile: () => SPDocument;
    openDocument: () => Promise<SPDocument | null>;
    openProject: () => Promise<SPDocument | null>;
    closeDocument: (id: string) => Promise<boolean>;
    saveDocument: (doc: SPDocument) => Promise<string | null>;
    saveDocumentCopy: (doc: SPDocument) => Promise<string | null>;
    saveBinary: (type: SPBinaryType, content: Uint8Array) => Promise<string | null>;
}

const UserContext = createContext<UserContextState>({} as UserContextState);
const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }: any) => {
    const [state, setState] = useState<UserContextState>({
        documents: [] as SPDocument[],
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
            return state.documents.find(d => d.id === state.activeTab)
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

        function updateDocument (docId: string, content: SPDocumentContent) {
            const index = _getDocumentIndexById(docId);
            if (index === null) return;

            const newArr = [...state.documents];
            newArr[index] = {
                ...newArr[index],
                hasUnsavedChanges: true,
                content: content,
            };

            setState(prevState => ({
                ...prevState,
                documents: newArr,
            }));
        }

        async function createNewProject (
            directory: string,
            folderName: string,
            displayName: string,
            resourcePack: string
        ) : Promise<SPDocument | null> {
            const project = await Ipc.createNewProject(
                directory + "/" + folderName,
                displayName,
                resourcePack
            );
    
            if (project === null) {
                console.error("Error while creating project.");
                return null;
            }

            return _openFolderDocument(project);
        }

        function createNewLevel () : SPDocument {
            const level = getNewLevel();
            return _createNewDocument(level);
        }
        function createNewWorld () : SPDocument {
            const world = getNewWorld();
            return _createNewDocument(world);
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

        async function openProject () : Promise<SPDocument | null> {
            const project = await Ipc.openProject("Open project's manifest");
            if (project === null) return null;

            console.log(project);

            return _openFolderDocument(project);
        }

        async function closeDocument (id: string) {
            return await _promptCloseDocument(id);
        }

        /**
         * Saves the current document, overwriting its previous file if it
         * already exists in disk. If it doesn't, then acts like `saveDocumentCopy()`.
         * @param doc The document to save.
         * @returns The full path of the file saved, or null if the file is new
         * and the user canceled the operation.
         */
        async function saveDocument (doc: SPDocument) {
            // TODO: Mark document as without changes.
            const filePath = await _saveDocument(doc);
            if (filePath !== null) {
                _setDocAsUnsaved(doc.id, false);
            }
            return filePath;
        }

        async function saveDocumentCopy (doc: SPDocument) {
            const path = await _saveNewDocument(doc);
            if (path !== null) {
                _setDocAsUnsaved(doc.id, false);
            }
            return path;
        }

        async function saveBinary (type: SPBinaryType, content: Uint8Array) {
            return await _saveNewBinary(type, content);
        }

        return {
            ...state,
            getActiveDocument,
            setActiveTab,
            updateDocument,
            createNewProject,
            createNewLevel,
            createNewWorld,
            createNewEntity,
            createNewTile,
            openDocument,
            openProject,
            closeDocument,
            saveDocument,
            saveDocumentCopy,
            saveBinary,
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
            documents: [
                ...prevState.documents,
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
                    "spr-ent", "spr-til", "spr-tic", "spr-tbr",
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
                    "spr-tic"
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

        const content: SPDocumentContent = JSON.parse(fileInfo.content);

        if (!content) return null;

        return _openFileDocument(fileInfo, content);
    }

    function _openFileDocument (
        fileInfo: FileInfo<string>, content: SPDocumentContent
    ) {
        const doc: SPDocument = {
            id: fileInfo.fullPath,
            baseName: fileInfo.baseName,
            fileName: fileInfo.fileName,
            fullPath: fileInfo.fullPath,
            content: content,
            hasUnsavedChanges: false,
        };

        _openFileInEditor(doc);

        return doc;
    }

    function _openFolderDocument (content: SPFolderContent) {
        const doc: SPDocument = {
            id: content.fullPath,
            displayName: content.manifest.displayName,
            baseName: content.folderName,
            fullPath: content.fullPath,
            content: content,
            hasUnsavedChanges: false,
        }

        _openFileInEditor(doc);

        return doc;
    }

    function _openFileInEditor (doc: SPDocument) {
        // try to find the newly opened document within the array of
        // documents that are already opened.
        const currentDoc = state.documents.find(d => d.fullPath === doc.fullPath);
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
                documents: [
                    ...prevState.documents,
                    doc,
                ],
                activeTab: doc.id,
            }));
        }
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
            document.baseName ?? document.id,
            document.content.type,
            document.fullPath ?? null,
            json
        );
        
        if (closed) {
            _removeOpenDocument(document);
        }

        return closed;
    }

    async function _saveDocument (document: SPDocument) : Promise<string | null> {
        const json = JSON.stringify(document.content, null, 4);

        if (document.fullPath) {
            Ipc.saveDocument(document.fullPath, json);
            return document.fullPath;
        }
        else {
            return await _saveNewDocument(document);
        }
    }

    async function _saveNewDocument (document: SPDocument) : Promise<string | null> {
        const json = JSON.stringify(document.content, null, 4);

        const metadata = await Ipc.saveNewDocument(document.content.type, json);
        if (metadata === null) return null;
        const index = state.documents.findIndex(d => d.id === document.id);
        if (index === -1) return null;

        const update = [...state.documents];
        update[index] = {
            ...state.documents[index],
            id: metadata.id,
            fullPath: metadata.fullPath,
            fileName: metadata.fileName,
            baseName: metadata.baseName,
        };

        setState(prevState => ({
            ...prevState,
            documents: update,
            activeTab: prevState.activeTab === document.id
                ? metadata.id
                : prevState.activeTab,
        }));

        return metadata.fullPath;
    }

    async function _saveNewBinary (type: SPBinaryType, content: Uint8Array)
        : Promise<string | null>
    {
        const metadata = await Ipc.saveNewBinary(type, content);
        return metadata?.fullPath ?? null;
    }

    /**
     * Removes the document given from the array of opened documents in the app.
     * If the given document was the active one, selects the document immediately
     * before it as the new active document.
     * @param document The document to remove.
     */
    function _removeOpenDocument (document: SPDocument) {
        let index = state.documents.findIndex(d => d.id === document.id);
        if (index < 0) return;

        const newArr = [...state.documents];
        deleteArrayItemAt(newArr, index);
        
        index = Math.max(index - 1, 0);
        // if the document we are closing is the active document
        const newActiveTab = document.id === state.activeTab
            ? (newArr[index]?.id ?? null) // select a new active document
            : state.activeTab; // else don't select anything new

        // using setTimeout to launch this in the next frame guarantees that
        // activeTab won't get overriden even if the click that closed the tab
        // also selected it in the same moment. This can happen, for example,
        // if the close button on a tab doesn't prevent the tab from being selected.
        setTimeout(
            () => setState(prevState => ({
                ...prevState,
                documents: newArr,
                activeTab: newActiveTab,
            })),
            0
        );
    }

    function _setDocAsUnsaved (docId: string, unsaved: boolean) {
        const index = _getDocumentIndexById(docId);
        if (index === null) return;

        setState(prevState => {
            const newArr = [...prevState.documents];
            newArr[index] = {
                ...newArr[index],
                hasUnsavedChanges: unsaved,
            };

            return {
                ...prevState,
                documents: newArr,
            };
        });
    }

    /**
     * Returns the document that matches the given id, if it exists, or null
     * if it doesn't.
     * @param id The id to try to find.
     */
    function _getDocumentById (id: string) : SPDocument | null {
        return state.documents.find(d => d.id === id) ?? null;
    }

    /**
     * Returns the index of the document that matches the given id, if it exists,
     * or null if it doesn't.
     * @param id The id to try to find.
     */
    function _getDocumentIndexById (id: string) : number | null {
        const index = state.documents.findIndex(d => d.id === id);
        return index < 0 ? null : index;
    }
}

export {
    UserContextProvider, useUserContext
};

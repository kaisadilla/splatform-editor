import { MediaAssetMetadata, ResourcePack } from "models/ResourcePack";
import { HANDLER_GET_USERDATA_PATH, HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY, HANDLER_SAVE_NEW_TEXT_FILE, HANDLER_OPEN_TEXT_FILE, HANDLER_CLOSE_DOCUMENT, HANDLER_SAVE_NEW_DOCUMENT, HANDLER_SAVE_DOCUMENT, HANDLER_SAVE_BINARY, HANDLER_OPEN_DIRECTORY } from "./ipcNames";
import { FileInfo, FolderInfo } from "main/files/documentFiles";
import { SPBinaryType, SPDocumentType } from "models/sp_documents";

const Ipc = {
    /**
     * Checks that the renderer and main processes can communicate correctly
     * through the IPC.
     * @returns "Sanity check confirmed" when it works.
     */
    async sanity (obj: any) : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_SANITY, obj);
    },

    async getUserdataPath () : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_GET_USERDATA_PATH);
    },

    async loadResourcePacks () : Promise<ResourcePack[]> {
        return await getIpcRenderer().invoke(HANDLER_LOAD_RESOURCE_PACKS);
    },

    async openTextFile (title: string, filters: Electron.FileFilter[])
        : Promise<FileInfo<string> | null>
    {
        return await getIpcRenderer().invoke(HANDLER_OPEN_TEXT_FILE, {
            title, filters,
        });
    },

    async openDirectory (title: string)
        : Promise<FolderInfo | null>
    {
        return await getIpcRenderer().invoke(HANDLER_OPEN_DIRECTORY, title);
    },

    async saveNewTextFile (
        title: string,
        content: string,
        filters: Electron.FileFilter[],
    ) : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_SAVE_NEW_TEXT_FILE, {
            title, content, filters,
        });
    },

    /**
     * Saves the document given to the path given, overwriting the file if it
     * exists.
     * @param fullPath The path of the file to write.
     * @param content The content to write in the file.
     * @returns 
     */
    async saveDocument (
        fullPath: string, content: string,
    ) : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_SAVE_DOCUMENT, {
            fullPath, content,
        });
    },

    async saveNewDocument (
        type: SPDocumentType, content: string,
    ) : Promise<MediaAssetMetadata | null> {
        return await getIpcRenderer().invoke(HANDLER_SAVE_NEW_DOCUMENT, {
            type, content,
        });
    },

    /**
     * Prompts the user to confirm if they want to close the document, and to
     * save or discard changes if that's the case.
     * @param tabName The name of the file displayed in places such as its tab.
     * @param type The type of the document being closed.
     * @param fullPath The full path of the file containing this document, or
     * `null` if this document hasn't been saved to the disk yet.
     * @param content The current contents of the document.
     * @returns True if the user chose to close the tab, or false if they
     * canceled the action.
     */
    async closeDocument (
        tabName: string,
        type: SPDocumentType,
        fullPath: string | null,
        content: string
    ) : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_CLOSE_DOCUMENT, {
            tabName, type, fullPath, content
        });
    },

    async saveNewBinary (type: SPBinaryType, content: Uint8Array)
        : Promise<MediaAssetMetadata | null>
    {
        return await getIpcRenderer().invoke(HANDLER_SAVE_BINARY, {
            type, content,
        });
    },
}

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;
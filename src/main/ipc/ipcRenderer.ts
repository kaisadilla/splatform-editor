import { ResourcePack } from "models/ResourcePack";
import { HANDLER_GET_USERDATA_PATH, HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY, HANDLER_SAVE_NEW_TEXT_FILE } from "./ipcNames";
import { saveNewTextFile } from "main/files/write";

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

    async saveNewTextFile (
        title: string,
        content: string,
        filters: Electron.FileFilter[],
    ) : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_SAVE_NEW_TEXT_FILE, {
            title, content, filters,
        });
    },
}

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;
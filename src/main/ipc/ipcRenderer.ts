import { ResourcePack } from "models/ResourcePack";
import { HANDLER_LOAD_RESOURCE_PACKS, HANDLER_SANITY } from "./ipcNames";

const Ipc = {
    /**
     * Checks that the renderer and main processes can communicate correctly
     * through the IPC.
     * @returns "Sanity check confirmed" when it works.
     */
    async sanity (obj: any) : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_SANITY, obj);
    },
    async loadResourcePacks () : Promise<ResourcePack[]> {
        return await getIpcRenderer().invoke(HANDLER_LOAD_RESOURCE_PACKS);
    }
}

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;
import Ipc from "main/ipc/ipcRenderer";
import { ResourcePack } from "models/ResourcePack";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export enum AppStatus {
    /**
     * SPlatform data files are being read.
     */
    LoadingData = 0,
    /**
     * SPlatform is generating new data to use within the app.
     */
    BuildingCache,
    /**
     * The app is ready to be used.
     */
    Ready
}

interface AppContextState {
    appStatus: AppStatus;
    userdataPath: string;
    resourcePacks: ResourcePack[];
    isShiftKeyPressed: boolean;
    isCtrlKeyPressed: boolean;
    isAltKeyPressed: boolean;
    getResourcePack: (packId: string | null) => ResourcePack | null;
    setShiftKeyPressed: (pressed: boolean) => void;
    setCtrlKeyPressed: (pressed: boolean) => void;
    setAltKeyPressed: (pressed: boolean) => void;
}

const AppContext = createContext<AppContextState>({} as AppContextState);
const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: any) => {
    const [state, setState] = useState<AppContextState>({
        appStatus: AppStatus.LoadingData,
        userdataPath: "",
        resourcePacks: [] as ResourcePack[],
        isShiftKeyPressed: false,
        isCtrlKeyPressed: false,
        isAltKeyPressed: false,
    } as AppContextState);

    useEffect(() => {
        loadData();
    }, []);

    const value = useMemo(() => {
        function getResourcePack (packId: string | null) {
            return state.resourcePacks.find(r => r.folderName === packId) ?? null;
        }

        function setShiftKeyPressed (pressed: boolean) {
            setState(prevState => ({
                ...prevState,
                isShiftKeyPressed: pressed,
            }))
        }

        function setCtrlKeyPressed (pressed: boolean) {
            setState(prevState => ({
                ...prevState,
                isCtrlKeyPressed: pressed,
            }))
        }

        function setAltKeyPressed (pressed: boolean) {
            setState(prevState => ({
                ...prevState,
                isAltKeyPressed: pressed,
            }))
        }

        return {
            ...state,
            getResourcePack,
            setShiftKeyPressed,
            setCtrlKeyPressed,
            setAltKeyPressed,
        }
    }, [state]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

    async function loadData () {
        const userdataPath = await Ipc.getUserdataPath();
        const resourcePacks = await loadResourcePacks();

        setState(prevState => ({
            ...prevState,
            appStatus: AppStatus.Ready,
            userdataPath: userdataPath,
            resourcePacks: resourcePacks,
        }));
    }
    
    async function loadResourcePacks () : Promise<ResourcePack[]> {
        const resPacks = await Ipc.loadResourcePacks();

        for (const rp of resPacks) {
            rp.entitiesById = {};
            rp.tilesById = {};

            for (const e of rp.entities) {
                rp.entitiesById[e.id] = e;
            }

            for (const t of rp.tiles) {
                rp.tilesById[t.id] = t;
            }
        }

        return resPacks;
    }
}

export {
    useAppContext,
    AppContextProvider,
};
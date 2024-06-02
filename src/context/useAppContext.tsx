import Ipc from "main/ipc/ipcRenderer";
import { ResourcePack } from "models/ResourcePack";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export enum AppStatus {
    /**
     * SPlatform data files are being read.
     */
    LoadingData = 0,
    /**
     * The app is ready to be used.
     */
    Ready
}

interface AppContextState {
    appStatus: AppStatus;
    resourcePacks: ResourcePack[];
}

const AppContext = createContext<AppContextState>({} as AppContextState);
const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: any) => {
    const [state, setState] = useState<AppContextState>({
        appStatus: AppStatus.LoadingData,
        resourcePacks: [] as ResourcePack[],
    });

    useEffect(() => {
        loadData();
    }, []);

    const value = useMemo(() => {
        return {
            ...state,
        }
    }, [state]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

    async function loadData () {
        const resourcePacks = await Ipc.loadResourcePacks();

        setState(prevState => ({
            ...prevState,
            appStatus: AppStatus.Ready,
            resourcePacks: resourcePacks,
        }));
    }
}

export {
    useAppContext,
    AppContextProvider,
};
import { CSS_VARIABLES } from "_constants";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCssVariableValue } from "utils";

enum Setting {

}

interface CssVariableCollection {
    bgColor: string;
    componentColorTheme: {
        shade0: string;
        shade1: string;
        shade2: string;
        shade3: string;
        shade4: string;
    };
    highlightColors: {
        default: string;
        light1: string;
        light2: string;
        dark1: string;
        dark2: string;
    };
}

interface SettingsContextState {
    cssVariables: CssVariableCollection;
}

const SettingsContext = createContext<SettingsContextState>({} as SettingsContextState);
const useSettingsContext = () => useContext(SettingsContext);

const SettingsContextProvider = ({ children }: any) => {
    const [state, setState] = useState<SettingsContextState>({
        cssVariables: readCssVariables(),
    } as SettingsContextState);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            cssVariables: readCssVariables(),
        }))
    }, []);

    const value = useMemo(() => {
        
        return {
            ...state,
        }
    }, [state]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );

    function readCssVariables () : CssVariableCollection {
        return {
            bgColor: getCssVariableValue(CSS_VARIABLES.BgColor),
            componentColorTheme: {
                shade0: getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0),
                shade1: getCssVariableValue(CSS_VARIABLES.ComponentColorTheme1),
                shade2: getCssVariableValue(CSS_VARIABLES.ComponentColorTheme2),
                shade3: getCssVariableValue(CSS_VARIABLES.ComponentColorTheme3),
                shade4: getCssVariableValue(CSS_VARIABLES.ComponentColorTheme4),
            },
            highlightColors: {
                default: getCssVariableValue(CSS_VARIABLES.HighlightColor0),
                light1: getCssVariableValue(CSS_VARIABLES.HighlightColorL1),
                light2: getCssVariableValue(CSS_VARIABLES.HighlightColorL2),
                dark1: getCssVariableValue(CSS_VARIABLES.HighlightColorD1),
                dark2: getCssVariableValue(CSS_VARIABLES.HighlightColorD2),
            },
        }
    }
}

export {
    useSettingsContext,
    SettingsContextProvider,
};

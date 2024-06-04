import { TilePaint } from "models/sp_documents";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { WithId } from "utils";

export type GridTool =
    'select'
    | 'brush'
    | 'rectangle'
    | 'eraser'
    | 'bucket'
    | 'move' 
    | 'picker';

interface LevelEditorContextState {
    selectedPaint: WithId<TilePaint> | null;
    selectedGridTool: GridTool;
    setSelectedPaint: (paint: WithId<TilePaint> | null) => void;
    setSelectedGridTool: (tool: GridTool) => void;
}

const LevelEditorContext = createContext<LevelEditorContextState>({} as LevelEditorContextState);
const useLevelEditorContext = () => useContext(LevelEditorContext);

const LevelEditorContextProvider = ({ children }: any) => {
    const [state, setState] = useState<LevelEditorContextState>({
        selectedPaint: null,
        selectedGridTool: 'select',
    } as LevelEditorContextState);

    const value = useMemo(() => {
        function setSelectedPaint (paint: WithId<TilePaint> | null) {
            setState(prevState => ({
                ...state,
                selectedPaint: paint,
            }));
        }

        function setSelectedGridTool (tool: GridTool) {
            setState(prevState => ({
                ...state,
                selectedGridTool: tool,
            }));
        }

        return {
            ...state,
            setSelectedPaint,
            setSelectedGridTool,
        }
    }, [state]);

    return (
        <LevelEditorContext.Provider value={value}>
            {children}
        </LevelEditorContext.Provider>
    );
}

export {
    useLevelEditorContext,
    LevelEditorContextProvider,
};

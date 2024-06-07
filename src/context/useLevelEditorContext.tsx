import { TilePaint } from "models/sp_documents";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { WithId } from "utils";

export type GridTool =
    'select'
    | 'brush'
    | 'rectangle'
    | 'eraser'
    | 'bucket'
    | 'picker';

interface LevelEditorContextState {
    selectedPaint: WithId<TilePaint> | null;
    selectedGridTool: GridTool;
    selectedTileLayer: number;
    showGrid: boolean;
    setSelectedPaint: (paint: WithId<TilePaint> | null) => void;
    setSelectedGridTool: (tool: GridTool) => void;
    setSelectedTileLayer: (index: number) => void;
    setShowGrid: (show: boolean) => void;
    getSelectableGridTools: () => GridTool[];
}

const LevelEditorContext = createContext<LevelEditorContextState>({} as LevelEditorContextState);
const useLevelEditorContext = () => useContext(LevelEditorContext);

const LevelEditorContextProvider = ({ children }: any) => {
    const [state, setState] = useState<LevelEditorContextState>({
        selectedPaint: null,
        selectedGridTool: 'select',
        selectedTileLayer: 0,
        showGrid: false,
    } as LevelEditorContextState);

    const value = useMemo(() => {
        function setSelectedPaint (paint: WithId<TilePaint> | null) {
            setState(prevState => ({
                ...prevState,
                selectedPaint: paint,
            }));
        }

        function setSelectedGridTool (tool: GridTool) {
            setState(prevState => ({
                ...prevState,
                selectedGridTool: tool,
            }));
        }

        function setSelectedTileLayer (index: number) {
            setState(prevState => ({
                ...prevState,
                selectedTileLayer: index,
            }));
        }

        function setShowGrid (show: boolean) {
            setState(prevState => ({
                ...prevState,
                showGrid: show,
            }));
        }

        /**
         * Returns a list of grid tools that can be selected right now.
         */
        function getSelectableGridTools () {
            const selectableTools = [] as GridTool[];

            selectableTools.push('select', 'eraser', 'picker');

            if (state.selectedPaint !== null) {
                selectableTools.push('brush', 'rectangle', 'bucket');
            }

            return selectableTools;
        }

        return {
            ...state,
            setSelectedPaint,
            setSelectedGridTool,
            setSelectedTileLayer,
            setShowGrid,
            getSelectableGridTools,
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

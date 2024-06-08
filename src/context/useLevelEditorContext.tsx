import { TilePaint } from "models/sp_documents";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { WithId } from "utils";

export type ZoomLevel = '0.25' | '0.5' | '1' | '2' | '3' | '4' | '6' | '8';

export type GridTool =
    'select'
    | 'brush'
    | 'rectangle'
    | 'eraser'
    | 'bucket'
    | 'picker'
;

interface LevelEditorContextState {
    zoom: ZoomLevel;
    paint: WithId<TilePaint> | null;
    terrainGridTool: GridTool;
    selectedTileLayer: number;
    showGrid: boolean;
    setZoom: (zoom: ZoomLevel) => void;
    setPaint: (paint: WithId<TilePaint> | null) => void;
    setTerrainGridTool: (tool: GridTool) => void;
    setSelectedTileLayer: (index: number) => void;
    setShowGrid: (show: boolean) => void;
    getSelectableGridTools: () => GridTool[];
    getZoomMultiplier: () => number;
}

const LevelEditorContext = createContext<LevelEditorContextState>({} as LevelEditorContextState);
const useLevelEditorContext = () => useContext(LevelEditorContext);

const LevelEditorContextProvider = ({ children }: any) => {
    const [state, setState] = useState<LevelEditorContextState>({
        zoom: '1',
        paint: null,
        terrainGridTool: 'select',
        selectedTileLayer: 0,
        showGrid: true,
    } as LevelEditorContextState);

    const value = useMemo(() => {
        function setZoom (zoom: ZoomLevel) {
            setState(prevState => ({
                ...prevState,
                zoom,
            }));
        }

        function setPaint (paint: WithId<TilePaint> | null) {
            setState(prevState => ({
                ...prevState,
                paint,
            }));
        }

        function setTerrainGridTool (tool: GridTool) {
            setState(prevState => ({
                ...prevState,
                terrainGridTool: tool,
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

        function getZoomMultiplier () {
            switch (state.zoom) {
                case '0.25': return 0.25;
                case '0.5': return 0.5;
                case '1': return 1;
                case '2': return 2;
                case '3': return 3;
                case '4': return 4;
                case '6': return 6;
                case '8': return 8;
                default: return 1;
            }
        }

        /**
         * Returns a list of grid tools that can be selected right now.
         */
        function getSelectableGridTools () {
            const selectableTools = [] as GridTool[];

            selectableTools.push('select', 'eraser', 'picker');

            if (state.paint !== null) {
                selectableTools.push('brush', 'rectangle', 'bucket');
            }

            return selectableTools;
        }

        return {
            ...state,
            setZoom,
            setPaint,
            setTerrainGridTool,
            setSelectedTileLayer,
            setShowGrid,
            getSelectableGridTools,
            getZoomMultiplier,
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

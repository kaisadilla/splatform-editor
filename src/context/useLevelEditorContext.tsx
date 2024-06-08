import { TilePaint } from "models/sp_documents";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Vec2, WithId } from "utils";

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
    /**
     * The zoom applied to the editor canvas.
     */
    zoom: ZoomLevel;
    /**
     * The position of the tile(s) that are currently selected (in the active layer).
     */
    tileSelection: Vec2[];
    /**
     * Whether to paint the grid over the editor canvas.
     */
    showGrid: boolean;
    /**
     * The tile (or tile composite) currently used to paint new tiles.
     */
    paint: WithId<TilePaint> | null;
    /**
     * The selected tool for the terrain editor.
     */
    terrainTool: GridTool;
    /**
     * The terrain layer that is currently selected.
     */
    activeTerrainLayer: number;
    setZoom: (zoom: ZoomLevel) => void;
    setTileSelection: (positions: Vec2[]) => void;
    setPaint: (paint: WithId<TilePaint> | null) => void;
    setTerrainGridTool: (tool: GridTool) => void;
    setActiveTerrainLayer: (index: number) => void;
    setShowGrid: (show: boolean) => void;
    getZoomMultiplier: () => number;
    /**
     * Removes all tiles from the current selection. 
     */
    cancelSelection: () => void;
    getSelectableGridTools: () => GridTool[];
}

const LevelEditorContext = createContext<LevelEditorContextState>({} as LevelEditorContextState);
const useLevelEditorContext = () => useContext(LevelEditorContext);

const LevelEditorContextProvider = ({ children }: any) => {
    const [state, setState] = useState<LevelEditorContextState>({
        zoom: '2',
        tileSelection: [] as Vec2[],
        showGrid: true,
        paint: null,
        terrainTool: 'select',
        activeTerrainLayer: 0,
    } as LevelEditorContextState);

    const value = useMemo(() => {
        function setZoom (zoom: ZoomLevel) {
            setState(prevState => ({
                ...prevState,
                zoom,
            }));
        }

        function setTileSelection (tileSelection: Vec2[]) {
            setState(prevState => ({
                ...prevState,
                tileSelection,
            }));
        }

        function setPaint (paint: WithId<TilePaint> | null) {
            setState(prevState => ({
                ...prevState,
                paint,
            }));
        }

        function setTerrainTool (tool: GridTool) {
            setState(prevState => ({
                ...prevState,
                terrainTool: tool,
            }));
        }

        function setActiveTerrainLayer (index: number) {
            setState(prevState => ({
                ...prevState,
                activeTerrainLayer: index,
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

        function setShowGrid (show: boolean) {
            setState(prevState => ({
                ...prevState,
                showGrid: show,
            }));
        }

        function cancelSelection () {
            setState(prevState => ({
                ...prevState,
                tileSelection: [],
            }));
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
            setTileSelection,
            setPaint,
            setTerrainGridTool: setTerrainTool,
            setActiveTerrainLayer,
            setShowGrid,
            getZoomMultiplier,
            cancelSelection,
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

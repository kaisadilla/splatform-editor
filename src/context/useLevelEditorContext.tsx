import { Entity } from "models/Entity";
import { ResourcePack } from "models/ResourcePack";
import { TilePaint } from "models/sp_documents";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Vec2, WithId } from "utils";

export type ZoomLevel = '0.25' | '0.5' | '1' | '2' | '3' | '4' | '6' | '8';

export type PropertiesPanel = 'level' | 'item';

export type EditorSection =
    'terrain'
    | 'entity-tiles'
    | 'tracks'
    | 'warps'
    | 'spawns'
    | 'events'
;

export type GridTool =
    'select'
    | 'brush'
    | 'rectangle'
    | 'eraser'
    | 'bucket'
    | 'picker'
;

export type EditMode =
    'visual'
    | 'code'
;

interface LevelEditorContextState {
    /**
     * The resource pack currently in use by this level, if any.
     */
    resourcePack: ResourcePack | null;
    /**
     * The zoom applied to the editor canvas.
     */
    zoom: ZoomLevel;
    /**
     * The properties panel that is currently shown.
     */
    activePropertiesPanel: PropertiesPanel;
    activeSection: EditorSection;
    /**
     * The position of the tile(s) that are currently selected (in the active layer).
     */
    tileSelection: Vec2[];
    /**
     * The ids of the spawn(s) that are currently selected.
     */
    spawnSelection: string[];
    /**
     * Whether to paint the grid over the editor canvas.
     */
    showGrid: boolean;
    /**
     * The tile (or tile composite) currently used to paint new tiles.
     */
    terrainPaint: WithId<TilePaint> | null;
    /**
     * The entity currently selected to place new level entities.
     */
    entityPaint: Entity | null;
    /**
     * The selected tool for the terrain editor.
     */
    terrainTool: GridTool;
    /**
     * The terrain layer that is currently selected.
     */
    activeTerrainLayer: number;
    editMode: EditMode;
    /**
     * The json version of this level, to be used in the json editor. This value
     * should be manually updated whenever the user changes between visual and
     * code editors. This allows this field to hold invalid values while the
     * user is editing the code, without that resulting in a failure.
     */
    jsonVersion: string;
    setResourcePack: (pack: ResourcePack | null) => void;
    setZoom: (zoom: ZoomLevel) => void;
    setActivePropertiesPanel: (panel: PropertiesPanel) => void;
    setActiveSection: (section: EditorSection) => void;
    setTileSelection: (positions: Vec2[]) => void;
    setSpawnSelection: (ids: string[]) => void;
    setPaint: (paint: WithId<TilePaint> | null) => void;
    setEntityPaint: (paint: Entity | null) => void;
    setTool: (tool: GridTool | null) => void;
    setActiveTerrainLayer: (index: number) => void;
    setShowGrid: (show: boolean) => void;
    setEditMode: (mode: EditMode) => void;
    setJsonVersion: (value: string) => void;
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
        resourcePack: null,
        zoom: '2',
        activePropertiesPanel: 'level',
        activeSection: 'terrain',
        tileSelection: [] as Vec2[],
        spawnSelection: [] as string[],
        showGrid: true,
        terrainPaint: null,
        entityPaint: null,
        terrainTool: 'select',
        activeTerrainLayer: 0,
        editMode: 'visual',
    } as LevelEditorContextState);

    const value = useMemo(() => {
        function setResourcePack (pack: ResourcePack | null) {
            setState(prevState => ({
                ...prevState,
                resourcePack: pack,
            }));
        }

        function setZoom (zoom: ZoomLevel) {
            setState(prevState => ({
                ...prevState,
                zoom,
            }));
        }

        function setActivePropertiesPanel (panel: PropertiesPanel) {
            setState(prevState => ({
                ...prevState,
                activePropertiesPanel: panel,
            }));
        }

        function setActiveSection (section: EditorSection) {
            setState(prevState => ({
                ...prevState,
                activeSection: section,
            }));
        }

        function setTileSelection (tileSelection: Vec2[]) {
            setState(prevState => ({
                ...prevState,
                tileSelection,
            }));
        }

        function setSpawnSelection (spawnSelection: string[]) {
            setState(prevState => ({
                ...prevState,
                spawnSelection,
            }));
        }

        function setPaint (paint: WithId<TilePaint> | null) {
            setState(prevState => ({
                ...prevState,
                terrainPaint: paint,
            }));
        }

        function setEntityPaint (paint: Entity | null) {
            setState(prevState => ({
                ...prevState,
                entityPaint: paint,
            }));
        }

        function setTool (tool: GridTool | null) {
            setState(prevState => ({
                ...prevState,
                terrainTool: tool ?? 'select',
            }));
        }

        function setActiveTerrainLayer (index: number) {
            setState(prevState => ({
                ...prevState,
                activeTerrainLayer: index,
            }));
        }

        function setEditMode (mode: EditMode) {
            setState(prevState => ({
                ...prevState,
                editMode: mode,
            }));
        }

        function setJsonVersion (value: string) {
            setState(prevState => ({
                ...prevState,
                jsonVersion: value,
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
                spawnSelection: [],
            }));
        }

        /**
         * Returns a list of grid tools that can be selected right now.
         */
        function getSelectableGridTools () {
            const selectableTools = [] as GridTool[];

            if (state.activeSection === 'terrain') {
                selectableTools.push('select', 'eraser', 'picker');
    
                if (state.terrainPaint !== null) {
                    selectableTools.push('brush', 'rectangle', 'bucket');
                }
            }
            else if (state.activeSection === 'spawns') {
                selectableTools.push('select', 'eraser', 'picker');
    
                if (state.entityPaint !== null) {
                    selectableTools.push('brush');
                }
            }
            else {
                selectableTools.push('select');
            }

            return selectableTools;
        }

        return {
            ...state,
            setResourcePack,
            setZoom,
            setActivePropertiesPanel,
            setActiveSection,
            setTileSelection,
            setSpawnSelection,
            setPaint,
            setEntityPaint,
            setTool,
            setActiveTerrainLayer,
            setShowGrid,
            setEditMode,
            setJsonVersion,
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

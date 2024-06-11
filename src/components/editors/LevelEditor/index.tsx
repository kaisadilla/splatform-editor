import { SPDocument } from 'models/sp_documents';
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ToolIcons1x } from 'icons';
import { Level, PlacedTile, TileLayer } from 'models/Level';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SP_ResizeHandle } from 'elements/resizablePanel';
import LocalStorage from 'localStorage';
import LevelEditor_PropertiesPanel from './PropertiesPanel';
import LevelEditor_TilePalette from './TilePalette';
import { useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import LevelEditor_Content from './Content';
import { EditMode, ZoomLevel, useLevelEditorContext } from 'context/useLevelEditorContext';
import ActionBar, { ActionBarButton, ActionBarCustomElement, ActionBarElement, ActionBarNumberInput, ActionBarSelectInput, ActionBarToggle } from 'elements/ActionBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Vec2, vec2equals } from 'utils';
import { removePositionsFromTileList } from './calculations';
import JsonEditor from 'components/JsonEditor';
import LevelEditor_EntityPalette from './EntityPalette';

export type LevelChangeFieldHandler
    = <K extends keyof Level>(field: K, value: Level[K]) => void;
export type LevelChangeTileHandler
    = <K extends keyof PlacedTile>(
        layerIndex: number, tilePos: Vec2, field: K, value: PlacedTile[K]
    ) => void;

export interface LevelEditorProps {
    doc: SPDocument;
}

function LevelEditor ({
    doc
}: LevelEditorProps) {
    const { getResourcePack } = useAppContext();
    const { activeTab, updateDocument } = useUserContext();
    const levelCtx = useLevelEditorContext();

    const ref = useRef<HTMLDivElement>(null);

    const level = doc.content as Level;
    const pack = getResourcePack(level.resourcePack);

    useEffect(() => {
        levelCtx.setResourcePack(getResourcePack(level.resourcePack));
    }, [level.resourcePack]);

    useEffect(() => {
        if (levelCtx.editMode === 'visual') {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [activeTab, doc.id, levelCtx, levelCtx.editMode]);

    const actionBarElements: ActionBarElement[] = [
        {
            type: 'button',
            label: 'Save this file',
            icon: 'save',
            onClick: () => console.log("save!!!"),
        } as ActionBarButton,
        {
            type: 'separator',
        },
        {
            type: 'button',
            label: 'Test level',
            icon: 'play',
            onClick: () => console.log("test level!!!"),
        } as ActionBarButton,
        {
            type: 'separator',
        },
        {
            type: 'button',
            label: 'Generate map (.png)',
            icon: 'image',
            onClick: () => console.log("generate map!!!"),
        } as ActionBarButton,
        {
            type: 'toggle',
            label: 'Show file JSON',
            icon: 'json',
            value: levelCtx.editMode === 'code',
            onToggle: v => handleChangeEditMode(v ? 'code' : 'visual'),
        } as ActionBarToggle,
        {
            type: 'separator',
        },
        {
            type: 'toggle',
            label: 'Display grid (Ctrl + G)',
            icon: 'grid',
            value: levelCtx.showGrid,
            onToggle: levelCtx.setShowGrid,
        } as ActionBarToggle,
        {
            type: 'select',
            label: "Zoom",
            value: levelCtx.zoom,
            onChange: v => levelCtx.setZoom(v as ZoomLevel),
            selectProps: {
                data: [
                    { value: '0.25', label: "0.25x"},
                    { value: '0.5', label: "0.5x"},
                    { value: '1', label: "1x"},
                    { value: '2', label: "2x"},
                    { value: '3', label: "3x"},
                    { value: '4', label: "4x"},
                    { value: '6', label: "6x"},
                    { value: '8', label: "8x"},
                ] as {value: ZoomLevel, label: string}[],
                rightSection: <FontAwesomeIcon icon='chevron-down' />
            }
        } as ActionBarSelectInput,
    ]

    return (
        <div ref={ref} className="editor level-editor" tabIndex={-1}>
            <ActionBar
                className="level-toolbar"
                elements={actionBarElements}
            />

            {levelCtx.editMode === 'code' && <JsonEditor />}

            {levelCtx.editMode === 'visual' && <PanelGroup
                className="level-edition-container"
                direction='horizontal'
            >
                <Panel className="palette-container" defaultSize={6} minSize={4}>
                    <_Palette />
                </Panel>
                <SP_ResizeHandle direction='horizontal' />
                <Panel className="level-content-container" defaultSize={15} minSize={4}>
                    <LevelEditor_Content
                        pack={pack}
                        level={level}
                        onChangeField={handleFieldChange}
                    />
                </Panel>
                <SP_ResizeHandle direction='horizontal' />
                <Panel className="properties-panel-container" defaultSize={5} minSize={4}>
                    <LevelEditor_PropertiesPanel
                        level={level}
                        onChange={handleChange}
                        onChangeField={handleFieldChange}
                        onChangeResourcePack={handleResourcePackChange}
                        onChangeTile={handleTileChange}
                    />
                </Panel>
            </PanelGroup>}
        </div>
    );

    function handleChange (update: Level) {
        updateDocument(doc.id, update);
    }

    function handleFieldChange<K extends keyof Level> (field: K, value: Level[K]) {
        const update = {...level};
        update[field] = value;
        updateDocument(doc.id, update);
    }

    function handleResourcePackChange (value: string | null) {
        const update = {...level};
        update.resourcePack = value;
        updateDocument(doc.id, update);
    }

    function handleTileChange<K extends keyof PlacedTile> (
        layerIndex: number, tilePos: Vec2, field: K, value: PlacedTile[K]
    ) {
        const update = [...level.layers];
        update[layerIndex] = {...update[layerIndex]};
        update[layerIndex].tiles = [...update[layerIndex].tiles];

        const tileIndex = update[layerIndex].tiles.findIndex(
            t => vec2equals(t.position, tilePos)
        );
        if (tileIndex === -1) return;

        update[layerIndex].tiles[tileIndex] = {...update[layerIndex].tiles[tileIndex]};
        update[layerIndex].tiles[tileIndex][field] = value;

        handleFieldChange('layers', update);
    }

    function handleTileLayerChange<K extends keyof TileLayer> (
        layerIndex: number, field: K, value: TileLayer[K]
    ) {
        const update = [...level.layers];
        update[layerIndex] = {
            ...update[layerIndex],
            [field]: value,
        };
        
        handleFieldChange('layers', update);
    }

    function handleChangeEditMode (mode: EditMode) {
        levelCtx.setEditMode(mode);

        if (mode === 'visual') {
            const newLevel = parseLevelJson(levelCtx.jsonVersion);

            if (newLevel === null) {
                // invalid json
            }
            else {
                handleChange(newLevel);
            }
        }
        else if (mode === 'code') {
            levelCtx.setJsonVersion(JSON.stringify(level, null, 4));
        }
    }

    function handleKeyDown (evt: KeyboardEvent) {
        // if the current document is not the active tab, return.
        if (activeTab !== doc.id) return;
        // if the user hasn't clicked inside the editor, return.
        //if (ref.current?.contains(document.activeElement) === false) return;

        if (evt.ctrlKey === false) {
            handleSingleShortcut(evt);
        }
        else {
            handleCtrlShortcut(evt);
        }
    }

    function handleSingleShortcut (evt: KeyboardEvent) {
        const selectable = levelCtx.getSelectableGridTools();

        if (evt.key.toLowerCase() === 'm' && selectable.includes('select')) {
            levelCtx.setTerrainGridTool('select');
        }
        if (evt.key.toLowerCase() === 'b' && selectable.includes('brush')) {
            levelCtx.setTerrainGridTool('brush');
        }
        if (evt.key.toLowerCase() === 'r' && selectable.includes('rectangle')) {
            levelCtx.setTerrainGridTool('rectangle');
        }
        if (evt.key.toLowerCase() === 'e' && selectable.includes('eraser')) {
            levelCtx.setTerrainGridTool('eraser');
        }
        if (evt.key.toLowerCase() === 'g' && selectable.includes('bucket')) {
            levelCtx.setTerrainGridTool('bucket');
        }
        if (evt.key.toLowerCase() === 'i' && selectable.includes('picker')) {
            levelCtx.setTerrainGridTool('picker');
        }
        if (evt.code === 'Delete') {
            if (levelCtx.terrainTool === 'select') {
                removeTilesAt(...levelCtx.tileSelection);
            }
        }

    }

    function handleCtrlShortcut (evt: KeyboardEvent) {
        if (evt.key.toLowerCase() === 'g') {
            levelCtx.setShowGrid(!levelCtx.showGrid);
        }
    }

    function removeTilesAt (...pos: Vec2[]) {
        let tiles = [...level.layers[levelCtx.activeTerrainLayer].tiles];
        tiles = removePositionsFromTileList(tiles, pos);
        handleTileLayerChange(levelCtx.activeTerrainLayer, 'tiles', tiles);
        levelCtx.setTileSelection([]);
    }
}

interface _PaletteProps {
    
}

function _Palette ({
    
}: _PaletteProps) {
    const levelCtx = useLevelEditorContext();

    if (levelCtx.resourcePack === null) {
        return <div>No resource pack selected.</div>
    }

    return (
        <div>
            {levelCtx.activeSection === 'terrain' && <LevelEditor_TilePalette
                pack={levelCtx.resourcePack}
            />}
            {levelCtx.activeSection === 'spawns' && <LevelEditor_EntityPalette
                pack={levelCtx.resourcePack}
            />}
        </div>
    );
}


function parseLevelJson (json: string) : Level | null {
    // TODO: Implement validation of json file.
    if (false) return null;

    return JSON.parse(json) as Level;
}

export default LevelEditor;

import { SPDocument } from 'models/sp_documents';
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ToolIcons1x } from 'icons';
import { Level } from 'models/Level';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SP_ResizeHandle } from 'elements/resizablePanel';
import LocalStorage from 'localStorage';
import LevelEditor_PropertiesPanel from './PropertiesPanel';
import LevelEditor_TilesPalette from './TilesPalette';
import { useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import LevelEditor_Content from './Content';
import { ZoomLevel, useLevelEditorContext } from 'context/useLevelEditorContext';
import ActionBar, { ActionBarButton, ActionBarCustomElement, ActionBarElement, ActionBarNumberInput, ActionBarSelectInput, ActionBarToggle } from 'elements/ActionBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [activeTab, doc.id, levelCtx]);

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
            value: false,
            onToggle: () => console.log("json!!!"),
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

            <PanelGroup className="level-edition-container" direction='horizontal'>
                <Panel className="palette-container" defaultSize={6} minSize={4}>
                    <LevelEditor_TilesPalette
                        pack={pack}
                    />
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
                    />
                </Panel>
            </PanelGroup>
        </div>
    );

    function handleChange (update: Level) {
        updateDocument(doc.id, update);
    }

    function handleFieldChange (field: keyof Level, value: any) {
        const update = {...level};
        update[field] = value;
        updateDocument(doc.id, update);
    }

    function handleResourcePackChange (value: string | null) {
        const update = {...level};
        update.resourcePack = value;
        updateDocument(doc.id, update);
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

    }

    function handleCtrlShortcut (evt: KeyboardEvent) {
        if (evt.key.toLowerCase() === 'g') {
            levelCtx.setShowGrid(!levelCtx.showGrid);
        }
    }
}

export default LevelEditor;

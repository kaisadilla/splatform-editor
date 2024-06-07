import { SPDocument } from 'models/sp_documents';
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ToolIcons1x } from 'icons';
import { Level } from 'models/Level';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SP_ResizeHandle } from 'elements/resizablePanel';
import LocalStorage from 'localStorage';
import LevelEditor_PropertiesPanel from './LevelEditor.PropertiesPanel';
import LevelEditor_TilesPalette from './LevelEditor.TilesPalette';
import { useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import LevelEditor_Content from './LevelEditor.Content';
import { useLevelEditorContext } from 'context/useLevelEditorContext';

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
    }, [activeTab, doc.id]);

    return (
        <div ref={ref} className="editor level-editor" tabIndex={-1}>
            <div className="level-toolbar">
                <button><img src={ToolIcons1x.save} alt="" /></button>
                <button><img src={ToolIcons1x.play} alt="" /></button>
                <button><img src={ToolIcons1x.image} alt="" /></button>
                <button><img src={ToolIcons1x.json} alt="" /></button>
                <button><img src={ToolIcons1x.grid} alt="" /></button>
            </div>

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
        if (evt.key.toLowerCase() === 'm') {
            levelCtx.setSelectedGridTool('select');
        }
        if (evt.key.toLowerCase() === 'b') {
            levelCtx.setSelectedGridTool('brush');
        }
        if (evt.key.toLowerCase() === 'r') {
            levelCtx.setSelectedGridTool('rectangle');
        }
        if (evt.key.toLowerCase() === 'e') {
            levelCtx.setSelectedGridTool('eraser');
        }
        if (evt.key.toLowerCase() === 'g') {
            levelCtx.setSelectedGridTool('bucket');
        }
        if (evt.key.toLowerCase() === 'i') {
            levelCtx.setSelectedGridTool('picker');
        }
    }
}

export default LevelEditor;

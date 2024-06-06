import { SPDocument } from 'models/sp_documents';
import React from 'react';
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

export interface LevelEditorProps {
    doc: SPDocument;
}

function LevelEditor ({
    doc
}: LevelEditorProps) {
    const { getResourcePack } = useAppContext();
    const { updateDocument } = useUserContext();

    const level = doc.content as Level;

    const pack = getResourcePack(level.resourcePack);

    return (
        <div className="editor level-editor">
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
}

export default LevelEditor;

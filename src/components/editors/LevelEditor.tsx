import { SPDocument } from 'models/sp_documents';
import React from 'react';
import Editor from '@monaco-editor/react';
import { ToolIcons } from 'icons';
import { Level } from 'models/Level';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SP_ResizeHandle } from 'elements/resizablePanel';
import LocalStorage from 'localStorage';
import LevelEditor_PropertiesPanel from './LevelEditor.PropertiesPanel';
import LevelEditor_TilesPalette from './LevelEditor.TilesPalette';
import { useAppContext } from 'context/useAppContext';

export interface LevelEditorProps {
    doc: SPDocument;
}

function LevelEditor ({
    doc
}: LevelEditorProps) {
    const { resourcePacks } = useAppContext();

    const level = doc.content as Level;

    return (
        <div className="editor level-editor">
            <div className="level-toolbar">
                <button><img src={ToolIcons.playGreen} alt="" /></button>
                <button><img src={ToolIcons.json} alt="" /></button>
            </div>

            <PanelGroup className="level-edition-container" direction='horizontal'>
                <Panel className="palette" defaultSize={6} minSize={4}>
                    <LevelEditor_TilesPalette pack={resourcePacks[0]} />
                </Panel>
                <SP_ResizeHandle direction='horizontal' />
                <Panel className="level-content-container" defaultSize={15} minSize={4}>
                    <div className="level-grid-container">
                        <div className="level-grid-tools">(tools)</div>
                        <div className="level-grid">(grid)</div>
                    </div>
                    <div className="level-grid-features">
                        (terrain / spawns / events) -&gt; background / main
                    </div>
                </Panel>
                <SP_ResizeHandle direction='horizontal' />
                <Panel className="properties-panel-container" defaultSize={5} minSize={4}>
                    <LevelEditor_PropertiesPanel level={level} />
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default LevelEditor;

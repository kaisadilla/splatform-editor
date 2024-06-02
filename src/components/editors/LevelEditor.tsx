import { SPDocument } from 'models/sp_documents';
import React from 'react';
import Editor from '@monaco-editor/react';
import { ToolIcons } from 'icons';

export interface LevelEditorProps {
    doc: SPDocument;
}

function LevelEditor ({
    doc
}: LevelEditorProps) {
    return (
        <div className="editor level-editor">
            <div className="level-toolbar">
                <button><img src={ToolIcons.playGreen} alt="" /></button>
                <button><img src={ToolIcons.json} alt="" /></button>
            </div>
            <div className="palette">
                (tiles, enemies, whatever)
            </div>
            <div className="level-content">
                <div className="level-grid-container">
                    <div className="level-grid-tools">(tools)</div>
                    <div className="level-grid">(grid)</div>
                </div>
                <div className="level-grid-features">
                    (terrain / spawns / events) -&gt; background / main
                </div>
            </div>
            <div className="properties-panel">
                level properties, tile properties...
            </div>
        </div>
    );
}

export default LevelEditor;

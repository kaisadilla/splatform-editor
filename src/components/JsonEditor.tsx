import { Editor } from '@monaco-editor/react';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import React, { useState } from 'react';

export interface JsonEditorProps {
}

function JsonEditor ({
    
}: JsonEditorProps) {
    const levelCtx = useLevelEditorContext();

    return (
        <div className="json-editor-container">
            <Editor
                defaultLanguage='json'
                value={levelCtx.jsonVersion}
                onChange={v => levelCtx.setJsonVersion(v ?? "")}
            />
        </div>
    );
}

export default JsonEditor;

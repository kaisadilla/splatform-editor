import { Editor } from '@monaco-editor/react';
import React, { useState } from 'react';

export interface JsonEditorProps {
    document: string;
}

function JsonEditor ({
    document,
}: JsonEditorProps) {
    const [value, setValue] = useState(document);

    return (
        <div className="json-editor-container">
            <Editor
                defaultLanguage='json'
                value={value}
                onChange={v => setValue(v ?? "")}
            />
        </div>
    );
}

export default JsonEditor;

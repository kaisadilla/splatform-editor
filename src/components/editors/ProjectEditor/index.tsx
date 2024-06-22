import { Project } from 'models/Project';
import { SPDocument } from 'models/sp_documents';
import React from 'react';

export interface ProjectEditorProps {
    doc: SPDocument;
}

function ProjectEditor ({
    doc,
}: ProjectEditorProps) {
    const project = doc.content as Project;

    return (
        <div>
            {project.manifest.contentType} PROJECT EE;
        </div>
    );
}

export default ProjectEditor;

import { FileInput, Modal, ModalProps, TextInput } from '@mantine/core';
import DirectoryInput from 'elements/DirectoryInput';
import LocalStorage from 'localStorage';
import React, { useState } from 'react';

export interface CreateProjectModalProps extends ModalProps {

}

function CreateProjecModal ({
    ...modalProps
}: CreateProjectModalProps) {
    const [projectName, setProjectName] = useState("Project 1");
    const [folderName, setFolderName] = useState("project-1");
    const [parentFolder, setParentFolder] = useState(
        LocalStorage.directories.projects.get()
    );

    return (
        <Modal
            title="Create new project"
            classNames={{
                root: "sp-modal-root sp-new-project-root",
                content: "sp-modal-content sp-new-project-content",
                header: "sp-modal-header sp-new-project-header",
                title: "sp-modal-title sp-new-project-title",
                close: "sp-modal-close sp-new-project-close",
                body: "sp-modal-body sp-new-project-body",
            }}
            size="60%"
            {...modalProps}
        >
            <TextInput
                label="Project name"
                value={projectName}
                onChange={handleChangeProjectName}
            />
            <DirectoryInput
                label="Location"
                description="The directory in which to place this project's folder."
                value={parentFolder}
                onSelectPath={handleChangeParentFolder}
            />
        </Modal>
    );

    function handleChangeProjectName (v: React.ChangeEvent<HTMLInputElement>) {
        
    }

    function handleChangeParentFolder (v: string | null) {
        if (v === null) return;

        LocalStorage.directories.projects.set(v);
        setParentFolder(v);
    }
}

export default CreateProjecModal;

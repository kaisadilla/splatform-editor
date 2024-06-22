import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FileInput, Modal, ModalProps, Select, Text, TextInput } from '@mantine/core';
import { useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import DirectoryInput from 'elements/DirectoryInput';
import LocalStorage from 'localStorage';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useState } from 'react';
import { LOCALE, removeNonAscii } from 'utils';

export interface CreateProjectModalProps extends ModalProps {

}

function CreateProjectModal ({
    ...modalProps
}: CreateProjectModalProps) {
    const [displayName, setDisplayName] = useState("Project 1");
    const [folderName, setFolderName] = useState("project-1");
    const [directory, setDirectory] = useState(
        LocalStorage.directories.projects.get()
    );
    const [pack, setPack] = useState(null as string | null);

    const { resourcePacks } = useAppContext();
    const userCtx = useUserContext();
    const resourcePacksData = [];

    for (const pack of resourcePacks) {
        resourcePacksData.push({
            value: pack.folderName,
            label: pack.manifest.displayName,
        })
    }

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
            <div className="modal-content">
                <TextInput
                    label="Project name"
                    value={displayName}
                    onChange={handleChangeProjectName}
                />
                <DirectoryInput
                    label="Location"
                    description="The directory in which to place this project's folder."
                    value={directory}
                    onSelectPath={handleChangeParentFolder}
                />
                <Text size='sm'>
                    Project will be created in '{directory}\{folderName}'
                </Text>
                <Select
                    size='sm'
                    label="Resource pack"
                    placeholder="Select a pack"
                    data={resourcePacksData}
                    value={pack}
                    onChange={v => setPack(v)}
                    allowDeselect={false}
                    rightSection={<FontAwesomeIcon icon='chevron-down' />}
                    error={pack === null}
                />
            </div>
            <div className="sp-modal-bottom-ribbon">
                <Button variant='light' onClick={() => handleClose()}>
                    Cancel
                </Button>
                <Button
                    color='blue'
                    disabled={pack === null}
                    onClick={handleCreate}
                >
                    Create
                </Button>
            </div>
        </Modal>
    );

    function handleChangeProjectName (v: React.ChangeEvent<HTMLInputElement>) {
        const name = v.currentTarget.value;
        setDisplayName(name);

        let asciiName = removeNonAscii(name);
        asciiName = asciiName.toLocaleLowerCase(LOCALE);
        asciiName = asciiName.replaceAll(" ", "-");
        setFolderName(asciiName);
    }

    function handleChangeParentFolder (v: string | null) {
        if (v === null) return;

        LocalStorage.directories.projects.set(v);
        setDirectory(v);
    }

    function handleCreate () {
        createNewProject();
    }

    function handleClose () {
        modalProps.onClose();
    }

    async function createNewProject () {
        if (pack === null) return;
        if (directory === null) return;

        userCtx.createNewProject(directory, folderName, displayName, pack);
        modalProps.onClose();
    }
}

export default CreateProjectModal;

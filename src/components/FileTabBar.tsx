import { CloseButton, Modal, ScrollArea, Tabs } from '@mantine/core';
import { MaterialSymbol } from 'react-material-symbols';
import React from 'react';
import { useUserContext } from 'context/useUserContext';
import { FileIcons } from 'icons';
import { SPDocumentType } from 'models/sp_documents';
import { useDisclosure } from '@mantine/hooks';

export interface FileTabDefinition {
    value: string;
    displayName: string;
    icon: string;
}

export interface FileTabBarProps {
    
}

function FileTabBar ({}: FileTabBarProps) {
    const userCtx = useUserContext();

    const files = [];

    for (const doc of userCtx.documents) {
        files.push({
            id: doc.id,
            displayName: (doc.baseName ?? doc.id) + (doc.hasUnsavedChanges ? "*" : ""),
            icon: _getFileIcon(doc.content.type),
        });
    }

    return (<>
        <ScrollArea
            scrollbars='x'
            type='hover'
            //scrollbarSize={8}
            //onWheel={(evt) => console.log(evt)} // TODO: Add horizontal wheel scroll.
        >
            <Tabs.List>
                {files.map(f => (
                    <Tabs.Tab
                        key={f.id}
                        value={f.id}
                        rightSection={<CloseButton
                            classNames={{
                                root: "sp-close-button",
                            }}
                            size='sm'
                            onClick={(evt) => handleCloseDocument(evt, f.id)}
                        />}
                    >
                        <img src={f.icon} alt="" />
                        <span>{f.displayName}</span>
                    </Tabs.Tab>
                ))}
                <button
                    className="sp-tab-ribbon-tab sp-tab-ribbon-new-tab"
                    onClick={handleCreateDocument}
                >
                    <MaterialSymbol icon="add" />
                </button>
            </Tabs.List>
        </ScrollArea>
    </>);

    function handleCreateDocument () {
        userCtx.createNewLevel();
    }

    function handleCloseDocument (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
        userCtx.closeDocument(id);
        evt.stopPropagation();
    }
}

function _getFileIcon (fileType: SPDocumentType) {
    if (fileType === 'level') return FileIcons.level;
    if (fileType === 'world') return FileIcons.world;
    if (fileType === 'game') return FileIcons.game;
    if (fileType === 'resource_pack') return FileIcons.manifest;
    if (fileType === 'entity') return FileIcons.entity;
    if (fileType === 'tile') return FileIcons.tile;

    return FileIcons.manifest;
}

export default FileTabBar;

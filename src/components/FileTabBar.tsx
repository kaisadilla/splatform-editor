import { ScrollArea, Tabs } from '@mantine/core';
import { MaterialSymbol } from 'react-material-symbols';
import React from 'react';
import { useUserContext } from 'context/useUserContext';
import { FileIcons } from 'icons';
import { SPDocumentType } from 'models/sp_documents';

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

    for (const doc of userCtx.openDocuments) {
        files.push({
            value: doc.id,
            displayName: (doc.fileName ?? doc.id) + (doc.hasUnsavedChanges ? "*" : ""),
            icon: _getFileIcon(doc.content.type),
        });
    }

    return (
        <ScrollArea
            scrollbars='x'
            type='hover'
            classNames={{
                root: "tab-ribbon-root"
            }}
            //scrollbarSize={8}
            //onWheel={(evt) => console.log(evt)} // TODO: Add horizontal wheel scroll.
        >
            <Tabs.List>
                {files.map(f => (
                    <Tabs.Tab value={f.value} key={f.value}>
                        <img src={f.icon} alt="" />
                        <span>{f.displayName}</span>
                    </Tabs.Tab>
                ))}
                <button className="tab-ribbon-tab tab-ribbon-new-tab" onClick={k}>
                    <MaterialSymbol icon="add" />
                </button>
            </Tabs.List>
        </ScrollArea>
    );

    function k () {
        userCtx.createNewLevel();
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

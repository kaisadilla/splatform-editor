import { CloseIcon, ScrollArea, Tabs } from '@mantine/core';
import FileTabBar from 'components/FileTabBar';
import TitleBar from 'components/TitleBar';
import { AppStatus, useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import { FileIcons } from 'icons';
import { SPDocumentType } from 'models/sp_documents';
import React, { useEffect, useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';

const NO_DOCUMENT_VALUE = "null";

export interface WindowProps {
    
}

function Window (props: WindowProps) {
    const { appStatus } = useAppContext();
    const { openDocuments } = useUserContext();

    const [activeTab, setActiveTab] = useState(NO_DOCUMENT_VALUE);

    useEffect(() => {
        if (openDocuments.length > 0) {
            setActiveTab(openDocuments[openDocuments.length - 1].id);
        }
    }, [openDocuments.length]);
    
    if (appStatus != AppStatus.Ready) {
        return <div>Loading...</div>
    }

    const files = [];

    for (const doc of openDocuments) {
        files.push({
            value: doc.id,
            displayName: doc.fileName ?? doc.id,
            icon: _getFileIcon(doc.content.type),
        });
    }

    return (
        <div className="window">
            <TitleBar />
            <Tabs
                value={activeTab}
                // @ts-ignore - false syntax error.
                onChange={setActiveTab}
                classNames={{
                    root: "tab-ribbon-boxes",
                    list: "tab-ribbon-list",
                    tab: "tab-ribbon-tab",
                    tabLabel: "tab-ribbon-tab-label"
                }}
            >
                <FileTabBar
                    files={files}
                />

                <Tabs.Panel value={NO_DOCUMENT_VALUE}>
                    <h1>TODO: Welcome panel.</h1>
                </Tabs.Panel>
                <Tabs.Panel value="a">
                    Super mario bros 3 resource!
                </Tabs.Panel>
                <Tabs.Panel value="b">
                    Super mario bros 3 ALL STAR EDITION <hr />resource pack
                </Tabs.Panel>
                <Tabs.Panel value="c">
                    the always interesting level editor!
                </Tabs.Panel>
            </Tabs>
        </div>
    );
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

export default Window;

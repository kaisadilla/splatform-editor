import { CloseIcon, ScrollArea, Tabs } from '@mantine/core';
import { NO_DOCUMENT_ID } from '_constants';
import FilePanelContainer from 'components/FilePanelContainer';
import FileTabBar from 'components/FileTabBar';
import TitleBar from 'components/TitleBar';
import { AppStatus, useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import { FileIcons } from 'icons';
import { SPDocumentType } from 'models/sp_documents';
import React, { useEffect, useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';

export interface WindowProps {
    
}

function Window (props: WindowProps) {
    const { appStatus } = useAppContext();
    const { openDocuments } = useUserContext();

    const [activeTab, setActiveTab] = useState(NO_DOCUMENT_ID);

    useEffect(() => {
        if (openDocuments.length > 0) {
            setActiveTab(openDocuments[openDocuments.length - 1].id);
        }
    }, [openDocuments.length]);
    
    if (appStatus != AppStatus.Ready) {
        return <div>Loading...</div>
    }

    return (
        <div className="window">
            <TitleBar />
            <Tabs
                value={activeTab}
                // @ts-ignore - false syntax error.
                onChange={setActiveTab}
                classNames={{
                    root: "tab-root",
                    list: "tab-ribbon-list",
                    tab: "tab-ribbon-tab",
                    tabLabel: "tab-ribbon-tab-label",
                    panel: "tab-panel",
                }}
            >
                <FileTabBar/>
                <FilePanelContainer
                />
            </Tabs>
        </div>
    );
}

export default Window;

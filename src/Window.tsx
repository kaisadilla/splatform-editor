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
    const appCtx = useAppContext();
    const userCtx = useUserContext();

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, []);
    
    if (appCtx.appStatus != AppStatus.Ready) {
        return <div>Loading...</div>
    }

    return (
        <div className="window">
            <TitleBar />
            <Tabs
                value={userCtx.activeTab}
                // @ts-ignore - false syntax error.
                onChange={userCtx.setActiveTab}
                classNames={{
                    root: "sp-tab-root",
                    list: "sp-tab-ribbon-list",
                    tab: "sp-tab-ribbon-tab",
                    tabLabel: "sp-tab-ribbon-tab-label",
                    panel: "sp-tab-panel",
                }}
            >
                <FileTabBar />
                <FilePanelContainer />
            </Tabs>
        </div>
    );

    function handleKeyDown (evt: KeyboardEvent) {
        if (evt.key === 'Shift') {
            appCtx.setShiftKeyPressed(true);
        }
        else if (evt.key === 'Control') {
            appCtx.setCtrlKeyPressed(true);
        }
        else if (evt.key === 'Alt') {
            appCtx.setAltKeyPressed(true);
        }
    }

    function handleKeyUp (evt: KeyboardEvent) {
        if (evt.key === 'Shift') {
            appCtx.setShiftKeyPressed(false);
        }
        else if (evt.key === 'Control') {
            appCtx.setCtrlKeyPressed(false);
        }
        else if (evt.key === 'Alt') {
            appCtx.setAltKeyPressed(false);
        }
    }
}

export default Window;

import { ScrollArea, Tabs } from '@mantine/core';
import { MaterialSymbol } from 'react-material-symbols';
import React from 'react';
import { useUserContext } from 'context/useUserContext';

export interface FileTabDefinition {
    value: string;
    displayName: string;
    icon: string;
}

export interface FileTabBarProps {
    files: FileTabDefinition[];
}

function FileTabBar ({
    files,
}: FileTabBarProps) {
    const { createNewLevel } = useUserContext();

    return (
        <ScrollArea
            scrollbars='x'
            type='hover'
            //scrollbarSize={8}
            //onWheel={(evt) => console.log(evt)} // TODO: Add horizontal wheel scroll.
        >
            <Tabs.List>
                {files.map(f => (
                    <Tabs.Tab value={f.value}>
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
        createNewLevel();
    }
}

export default FileTabBar;

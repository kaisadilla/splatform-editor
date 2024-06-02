import { Box, Tabs } from '@mantine/core';
import { NO_DOCUMENT_ID } from '_constants';
import { useUserContext } from 'context/useUserContext';
import React from 'react';
import LevelEditor from './editors/LevelEditor';

export interface FilePanelContainerProps {
    
}

function FilePanelContainer (props: FilePanelContainerProps) {
    const { openDocuments } = useUserContext();

    console.log("open docs", openDocuments);

    return (<div className="tab-panel-container">
        <Tabs.Panel value={NO_DOCUMENT_ID}>
            <h1>TODO: Welcome panel.</h1>
        </Tabs.Panel>
        {openDocuments.map(doc => (
            <Tabs.Panel value={doc.id} key={doc.id}>
                {doc.content.type == 'level' && <LevelEditor doc={doc} />}
                {doc.content.type == 'world' && <div>World!</div>}
                {doc.content.type == 'game' && <div>Game!</div>}
                {doc.content.type == 'entity' && <div>Fearsome goomba!</div>}
                {doc.content.type == 'tile' && <div>Amicable question block</div>}
            </Tabs.Panel>
        ))}
    </div>);
}

export default FilePanelContainer;

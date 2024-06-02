import { Tabs } from '@mantine/core';
import TitleBar from 'components/TitleBar';
import React from 'react';

export interface WindowProps {
    
}

function Window (props: WindowProps) {

    return (
        <div className="window">
            <TitleBar />
            <Tabs defaultValue="smb3.sp-res">
                <Tabs.List>
                    <Tabs.Tab value="smb3.sp-res">smb3.sp-res</Tabs.Tab>
                    <Tabs.Tab value="smb3-as.sp-res">smb3-as.sp-res</Tabs.Tab>
                    <Tabs.Tab value="smb3-1-1.sp-lev">smb3-1-1.sp-lev</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="smb3.sp-res">
                    Super mario bros 3 resource!
                </Tabs.Panel>
                <Tabs.Panel value="smb3-as.sp-res">
                    Super mario bros 3 ALL STAR EDITION <hr />resource pack
                </Tabs.Panel>
                <Tabs.Panel value="smb3-1-1.sp-lev">
                    the always interesting level editor!
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

export default Window;

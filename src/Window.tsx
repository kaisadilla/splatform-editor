import { CloseIcon, Tabs } from '@mantine/core';
import TitleBar from 'components/TitleBar';
import { AppStatus, useAppContext } from 'context/useAppContext';
import { FileIcons } from 'icons';
import React, { useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';

export interface WindowProps {
    
}

function Window (props: WindowProps) {
    const { appStatus } = useAppContext();
    
    if (appStatus != AppStatus.Ready) {
        return <div>Loading...</div>
    }

    return (
        <div className="window">
            <TitleBar />

            <Tabs
                defaultValue="a"
                classNames={{
                    root: "tab-ribbon-boxes",
                    list: "tab-ribbon-list",
                    tab: "tab-ribbon-tab",
                    tabLabel: "tab-ribbon-tab-label"
                }}
            >
                <Tabs.List>
                    <Tabs.Tab value="a">
                        <img src={FileIcons.level} alt="" />
                        <span>level1-1.sp-lev</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="b">
                        <img src={FileIcons.world} alt="" />
                        <span>world1.sp-wld</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="c">
                        <img src={FileIcons.game} alt="" />
                        <span>smb3.sp-gme</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="d">
                        <img src={FileIcons.manifest} alt="" />
                        <span>smb3.sp-res</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="e">
                        <img src={FileIcons.entity} alt="" />
                        <span>goomba.spr-ent</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="f">
                        <img src={FileIcons.tile} alt="" />
                        <span>question_block.spr-til</span>
                    </Tabs.Tab>
                    <button className="tab-ribbon-tab tab-ribbon-new-tab">
                        <MaterialSymbol icon="add" />
                    </button>
                </Tabs.List>

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

export default Window;

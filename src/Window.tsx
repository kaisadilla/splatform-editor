import { Tabs } from '@mantine/core';
import TitleBar from 'components/TitleBar';
import React from 'react';
import levelIcon from "@assets/icons/level-file.png";
import worldIcon from "@assets/icons/world-file.png";
import gameIcon from "@assets/icons/game-file.png";
import manifestIcon from "@assets/icons/manifest-file.png";
import entityIcon from "@assets/icons/entity-file.png";
import tileIcon from "@assets/icons/tile-file.png";

export interface WindowProps {
    
}

function Window (props: WindowProps) {

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
                        <img src={levelIcon} alt="" />
                        <span>level1-1.sp-lev</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="b">
                        <img src={worldIcon} alt="" />
                        <span>world1.sp-wld</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="c">
                        <img src={gameIcon} alt="" />
                        <span>smb3.sp-gme</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="d">
                        <img src={manifestIcon} alt="" />
                        <span>smb3.sp-res</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="e">
                        <img src={entityIcon} alt="" />
                        <span>goomba.spr-ent</span>
                    </Tabs.Tab>
                    <Tabs.Tab value="f">
                        <img src={tileIcon} alt="" />
                        <span>question_block.spr-til</span>
                    </Tabs.Tab>
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

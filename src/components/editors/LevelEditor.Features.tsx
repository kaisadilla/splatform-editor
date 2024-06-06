import { CloseButton, ScrollArea, Tabs, Text } from '@mantine/core';
import ActivatableTextInput from 'elements/ActivatableTextInput';
import { Level } from 'models/Level';
import { ResourcePack } from 'models/ResourcePack';
import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';

export interface LevelEditor_FeaturesProps {
    pack: ResourcePack | null;
    level: Level;
    onChangeField: (field: keyof Level, val: any) => void;
}

function LevelEditor_Features ({
    pack,
    level,
    onChangeField,
}: LevelEditor_FeaturesProps) {

    return (
        <div className="level-grid-features">
            <Tabs
                defaultValue={'terrain'}
                // @ts-ignore - false syntax error.
                //onChange={userCtx.setActiveTab}
                classNames={{
                    root: "sp-section-tab-root",
                    list: "sp-section-tab-ribbon-list",
                    tab: "sp-section-tab-ribbon-tab",
                    tabLabel: "sp-section-tab-ribbon-tab-label",
                    panel: "sp-section-tab-panel",
                }}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value='terrain'
                    >
                        Terrain
                    </Tabs.Tab>
                    <Tabs.Tab
                        value='entity-tiles'
                    >
                        Entity tiles
                    </Tabs.Tab>
                    <Tabs.Tab
                        value='spawns'
                    >
                        Spawns
                    </Tabs.Tab>
                    <Tabs.Tab
                        value='events'
                    >
                        Events
                    </Tabs.Tab>
                </Tabs.List>

                <div className="sp-section-tab-panel-container level-grid-feature-options">
                    <Tabs.Panel value='terrain'>
                        <_TerrainTab
                            pack={pack}
                            level={level}
                            onChangeField={onChangeField}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value='entity-tiles'>
                        entity-tiles
                    </Tabs.Panel>
                    <Tabs.Panel value='spawns'>
                        spawns
                    </Tabs.Panel>
                    <Tabs.Panel value='events'>
                        events
                    </Tabs.Panel>
                </div>
            </Tabs>
        </div>
    );
}

interface _TerrainTabProps {
    pack: ResourcePack | null;
    level: Level;
    onChangeField: (field: keyof Level, val: any) => void;
}

function _TerrainTab ({
    pack,
    level,
    onChangeField,
}: _TerrainTabProps) {

    return (
        <div className="terrain-panel">
            <Tabs
                defaultValue={"0"}
                // @ts-ignore - false syntax error.
                //onChange={userCtx.setActiveTab}
                classNames={{
                    root: "sp-tab-root",
                    list: "sp-tab-ribbon-list",
                    tab: "sp-tab-ribbon-tab",
                    tabLabel: "sp-tab-ribbon-tab-label",
                    panel: "sp-tab-panel",
                }}
            >
                <ScrollArea scrollbars='x' type='hover'>
                    <Tabs.List>
                        {level.layers.map((l, i) => <Tabs.Tab
                            value={i.toString()}
                            rightSection={<CloseButton
                                classNames={{
                                    root: "sp-close-button",
                                }}
                                size='sm'
                            />}
                        >
                            <ActivatableTextInput
                                defaultValue={l.name}
                            />
                        </Tabs.Tab>)}
                        <button
                            className="sp-tab-ribbon-tab sp-tab-ribbon-new-tab"
                        >
                            <MaterialSymbol icon="add" />
                        </button>
                    </Tabs.List>
                </ScrollArea>

                <div className="sp-section-tab-panel-container level-grid-feature-options">
                    <Tabs.Panel value='terrain'>
                        aaa
                    </Tabs.Panel>
                    <Tabs.Panel value='entity-tiles'>
                        entity-tiles
                    </Tabs.Panel>
                </div>
            </Tabs>
        </div>
    );
}


export default LevelEditor_Features;

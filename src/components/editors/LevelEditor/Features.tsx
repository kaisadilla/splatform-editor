import { Checkbox, CloseButton, ScrollArea, Tabs, Text, Tooltip } from '@mantine/core';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import ActivatableTextInput from 'elements/ActivatableTextInput';
import { Level } from 'models/Level';
import { ResourcePack } from 'models/ResourcePack';
import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { deleteArrayItemAt } from 'utils';

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
                        value='circuits'
                    >
                        Circuits
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
                    <Tabs.Panel value='circuits'>
                        circuits, by tiles for tiles
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
    const levelCtx = useLevelEditorContext();

    return (
        <div className="terrain-panel">
            <Tabs
                value={levelCtx.selectedTileLayer.toString()}
                onChange={v => levelCtx.setSelectedTileLayer(Number(v))}
                // @ts-ignore - false syntax error.
                //onChange={userCtx.setActiveTab}
                classNames={{
                    root: "sp-tab-root",
                    list: "sp-tab-ribbon-list",
                    tab: "sp-tab-ribbon-tab terrain-tabs-tab",
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
                                onClick={evt => handleRemoveLayer(evt, i)}
                                disabled={level.layers.length < 2}
                            />}
                        >
                            <ActivatableTextInput
                                value={l.name}
                                onChange={evt => handleRenameLayer(evt, i)}
                            />
                        </Tabs.Tab>)}
                        <button
                            className="sp-tab-ribbon-tab sp-tab-ribbon-new-tab"
                            onClick={handleAddLayer}
                        >
                            <MaterialSymbol icon="add" />
                        </button>
                    </Tabs.List>
                </ScrollArea>

                <div className="sp-section-tab-panel-container level-grid-feature-options">
                    {level.layers.map((l, i) => <Tabs.Panel
                        classNames={{panel: "terrain-settings-form"}}
                        value={i.toString()}
                    >
                        <Tooltip refProp="rootRef" label="Whether entities (including the player) can collide with the tiles in this layer.">
                            <Checkbox
                                label="Active collisions"
                                checked={level.layers[i].settings.checksCollisions ?? false}
                                onChange={() => {}}
                            />
                        </Tooltip>
                    </Tabs.Panel>)}
                </div>
            </Tabs>
        </div>
    );

    function handleAddLayer () {
        const layers = [...level.layers];
        layers.push({
            name: "Unnamed layer",
            settings: {},
            tiles: []
        });

        onChangeField('layers', layers);
        levelCtx.setSelectedTileLayer(layers.length - 1);
    }

    function handleRenameLayer (
        evt: React.ChangeEvent<HTMLInputElement>, index: number
    ) {
        const layers = [...level.layers];
        layers[index] = {
            ...layers[index],
            name: evt.currentTarget.value
        };

        onChangeField('layers', layers);
    }

    function handleRemoveLayer (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number
    ) {
        evt.stopPropagation();
        const layers = [...level.layers];

        let newActiveLayer = levelCtx.selectedTileLayer;
        if (newActiveLayer >= index) newActiveLayer--;
        newActiveLayer = Math.max(0, newActiveLayer);

        deleteArrayItemAt(layers, index)
        onChangeField('layers', layers);
        levelCtx.setSelectedTileLayer(newActiveLayer);
    }
}


export default LevelEditor_Features;

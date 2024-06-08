import { Accordion, CloseButton, Input, NumberInput, Select, TextInput, Tooltip } from '@mantine/core';
import { useAppContext } from 'context/useAppContext';
import BackgroundAssetInput from 'elements/BackgroundAssetInput';
import MusicAssetInput from 'elements/MusicAssetInput';
import { Level, LevelSettings } from 'models/Level';
import React, { useState } from 'react';
import CSS_CLASSES from 'sp_css_classes';
import { clampNumber } from 'utils';

const MIN_DIMENSION_VAL = 10;
const MAX_DIMENSION_VAL = 100_000;

export interface LevelEditor_PropertiesPanelProps {
    level: Level;
    onChange: (update: Level) => void;
    onChangeField: (field: keyof Level, val: any) => void;
    onChangeResourcePack: (val: string | null) => void;
}

function LevelEditor_PropertiesPanel ({
    level,
    onChange,
    onChangeField,
    onChangeResourcePack,
}: LevelEditor_PropertiesPanelProps) {
    const { resourcePacks } = useAppContext();
    const resourcePacksData = [];

    for (const pack of resourcePacks) {
        resourcePacksData.push({
            value: pack.folderName,
            label: pack.manifest.displayName,
        })
    }

    return (
        <div className="level-properties">
            <Accordion
                classNames={{
                    root: "level-properties-accordion-root",
                    item: "level-properties-accordion-item sp-accordion-panel",
                    control: "level-properties-accordion-control sp-accordion-panel-control",
                    panel: "level-properties-accordion-control sp-accordion-panel-panel",
                }}
                multiple
                defaultValue={['level', 'target']}
            >
                <Accordion.Item value={'level'}>
                    <Accordion.Control>
                        Level properties
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Select
                            size='sm'
                            label="Resource pack"
                            placeholder="Select a pack"
                            data={resourcePacksData}
                            value={level.resourcePack}
                            onChange={v => onChangeResourcePack(v)}
                            allowDeselect={false}
                            comboboxProps={{
                                offset: -1,
                            }}
                        />
                        <TextInput
                            size='sm'
                            label="Name"
                            value={level.displayName}
                            onChange={evt => onChangeField(
                                'displayName', evt.currentTarget.value
                            )}
                        />
                        <NumberInput
                            size='sm'
                            label="Width"
                            value={level.settings.width}
                            //min={MIN_DIMENSION_VAL}
                            max={MAX_DIMENSION_VAL}
                            allowDecimal={false}
                            allowNegative={false}
                            onChange={handleWidthChange}
                        />
                        <NumberInput
                            size='sm'
                            label="Height"
                            value={level.settings.height}
                            //min={MIN_DIMENSION_VAL}
                            max={MAX_DIMENSION_VAL}
                            allowDecimal={false}
                            allowNegative={false}
                            onChange={handleHeightChange}
                        />
                        <BackgroundAssetInput
                            label="Background"
                            pack={level.resourcePack}
                            value={level.settings.background}
                            onSelectValue={v => handleSettingsValue('background', v)}
                        />
                        <MusicAssetInput
                            label="Music"
                            pack={level.resourcePack}
                            value={level.settings.music}
                            onSelectValue={v => handleSettingsValue('music', v)}
                        />
                        <NumberInput
                            size='sm'
                            label="Time"
                            value={level.settings.time}
                            min={1}
                            allowNegative={false}
                            stepHoldDelay={300}
                            stepHoldInterval={20}
                            onChange={handleTimeChange}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={'target'}>
                    <Accordion.Control>
                        Target properties
                    </Accordion.Control>
                    <Accordion.Panel>
                        <TextInput
                            size='sm'
                            label="Something"
                            placeholder="will depend"
                        />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
    );

    function handleSettingsValue (field: keyof LevelSettings, value: any) {
        onChangeField('settings', {
            ...level.settings,
            [field]: value,
        });
    }

    function handleWidthChange (value: any) {
        if (typeof value !== 'number') return;

        value = clampNumber(value, MIN_DIMENSION_VAL, MAX_DIMENSION_VAL);
        handleSettingsValue('width', value);
    }

    function handleHeightChange (value: any) {
        if (typeof value !== 'number') return;

        value = clampNumber(value, MIN_DIMENSION_VAL, MAX_DIMENSION_VAL);
        handleSettingsValue('height', value);
    }

    function handleTimeChange (value: any) {
        if (typeof value !== 'number') return;

        value = Math.max(value, 1);
        handleSettingsValue('time', value);
    }
}

export default LevelEditor_PropertiesPanel;

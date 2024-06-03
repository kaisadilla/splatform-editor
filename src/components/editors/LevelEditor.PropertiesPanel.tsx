import { Accordion, CloseButton, Input, NumberInput, TextInput, Tooltip } from '@mantine/core';
import { Level } from 'models/Level';
import React, { useState } from 'react';

export interface LevelEditor_PropertiesPanelProps {
    level: Level;
}

function LevelEditor_PropertiesPanel ({
    level
}: LevelEditor_PropertiesPanelProps) {

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
                        <TextInput
                            size='sm'
                            label="Name"
                            value={level.displayName}
                            readOnly
                        />
                        <NumberInput
                            size='sm'
                            label="Width"
                            value={level.settings.width}
                            min={10}
                            max={100_000}
                            allowDecimal={false}
                            readOnly
                        />
                        <NumberInput
                            size='sm'
                            label="Height"
                            value={level.settings.height}
                            min={10}
                            max={100_000}
                            allowDecimal={false}
                            readOnly
                        />
                        <TextInput
                            size='sm'
                            label="Background"
                            value={level.settings.background}
                            readOnly
                        />
                        <TextInput
                            size='sm'
                            label="Music"
                            value={level.settings.music}
                            readOnly
                        />
                        <TextInput
                            size='sm'
                            label="Time"
                            value={level.settings.time}
                            readOnly
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
}

export default LevelEditor_PropertiesPanel;

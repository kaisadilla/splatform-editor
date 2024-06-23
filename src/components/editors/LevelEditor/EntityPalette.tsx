import { Accordion, Tooltip } from '@mantine/core';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import EntityImage from 'elements/EntityImage';
import { Entity } from 'models/Entity';
import { DocumentMetadata, ResourcePack } from 'models/ResourcePack';
import React from 'react';
import { getClassString } from 'utils';

export interface LevelEditor_EntityPaletteProps {
    pack: ResourcePack | null;
}

function LevelEditor_EntityPalette ({
    pack,
}: LevelEditor_EntityPaletteProps) {
    const levelCtx = useLevelEditorContext();

    if (pack === null) {
        return <div className="info-panel">
            Select a resource pack to start editing this level.
        </div>;
    }

    const entitiesByGroup = {} as {[category: string]: DocumentMetadata<Entity>[]};

    for (const entity of pack.entities) {
        const group = entity.data.category ?? "null";
        if (entitiesByGroup[group] === undefined) {
            entitiesByGroup[group] = [];
        }

        entitiesByGroup[group].push(entity);
    }

    return (
        <div className="entity-palette">
            <Accordion
                classNames={{
                    root: "sp-accordion-root palette-root",
                    item: "sp-accordion-item palette-item",
                    control: "sp-accordion-control palette-control",
                    label: "sp-accordion-label palette-label",
                    panel: "sp-accordion-panel palette-panel",
                    content: "sp-accordion-content palette-panel-content"
                }}
                multiple
                defaultValue={Object.keys(entitiesByGroup)}
            >
                {Object.keys(entitiesByGroup).sort().map(gr => (<Accordion.Item
                    key={gr}
                    value={gr}
                >
                    <Accordion.Control>
                        {gr}
                    </Accordion.Control>
                    <Accordion.Panel>
                        {entitiesByGroup[gr].map(e => <_EntityButton
                            key={e.id}
                            pack={pack}
                            entity={e}
                            selected={e.data.id === levelCtx.entityPaint?.id}
                            onClick={() => levelCtx.setEntityPaint(e.data)}
                        />)}
                    </Accordion.Panel>
                </Accordion.Item>))}
            </Accordion>
        </div>
    );
}

interface _EntityButtonProps {
    pack: ResourcePack;
    entity: DocumentMetadata<Entity>;
    selected: boolean;
    onClick: () => void;
}

function _EntityButton ({
    pack,
    entity,
    selected,
    onClick,
}: _EntityButtonProps) {
    const className = getClassString(
        "entity-button",
        "sp-gallery-selectable-item",
        selected && "selected",
    );

    return (
        <Tooltip label={entity.data.name}>
            <div className={className} onClick={() => onClick()}>
                <EntityImage
                    pack={pack}
                    entity={entity.data}
                    size={56}
                    lookLeft
                />
            </div>
        </Tooltip>
    );
}


export default LevelEditor_EntityPalette;

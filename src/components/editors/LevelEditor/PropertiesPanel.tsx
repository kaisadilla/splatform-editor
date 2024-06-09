import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Checkbox, CloseButton, Input, NumberInput, Select, TextInput, Tooltip } from '@mantine/core';
import { useAppContext } from 'context/useAppContext';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import TileTraits, { TileTraitId, TraitParameterCollection } from 'data/TileTraits';
import BackgroundAssetInput from 'elements/BackgroundAssetInput';
import MusicAssetInput from 'elements/MusicAssetInput';
import { Level, LevelSettings, LevelTile, LevelTileParameterCollection } from 'models/Level';
import { Parameter, Trait } from 'models/SPlatform';
import { TileTraitDefinition } from 'models/Tile';
import React, { useState } from 'react';
import CSS_CLASSES from 'sp_css_classes';
import { clampNumber, vec2equals, vec2toString } from 'utils';
import { LevelChangeFieldHandler, LevelChangeTileHandler } from '.';
import TitledCheckbox from 'elements/TitledCheckbox';

const MIN_DIMENSION_VAL = 10;
const MAX_DIMENSION_VAL = 100_000;

export interface LevelEditor_PropertiesPanelProps {
    level: Level;
    onChange: (update: Level) => void;
    onChangeField: LevelChangeFieldHandler;
    onChangeResourcePack: (val: string | null) => void;
    onChangeTile: LevelChangeTileHandler;
}

function LevelEditor_PropertiesPanel ({
    level,
    onChange,
    onChangeField,
    onChangeResourcePack,
    onChangeTile,
}: LevelEditor_PropertiesPanelProps) {
    return (
        <div className="level-properties-panel">
            <Accordion
                classNames={{
                    root: "level-properties-accordion-root sp-accordion-panel-root",
                    item: "level-properties-accordion-item sp-accordion-panel-item",
                    control: "level-properties-accordion-control sp-accordion-panel-control",
                    content: "level-properties-accordion-content sp-accordion-panel-content",
                    panel: "level-properties-accordion-control sp-accordion-panel-panel",
                }}
                multiple
                defaultValue={['level', 'target']}
            >
                <_LevelProperties
                    level={level}
                    onChange={onChange}
                    onChangeField={onChangeField}
                    onChangeResourcePack={onChangeResourcePack}
                />
                <_TileProperties
                    level={level}
                    onChangeTile={onChangeTile}
                />
            </Accordion>
        </div>
    );
}

interface _LevelPropertiesProps {
    level: Level;
    onChange: (update: Level) => void;
    onChangeField: LevelChangeFieldHandler;
    onChangeResourcePack: (val: string | null) => void;
}

function _LevelProperties ({
    level,
    onChange,
    onChangeField,
    onChangeResourcePack,
}: _LevelPropertiesProps) {
    const { resourcePacks } = useAppContext();
    const resourcePacksData = [];

    for (const pack of resourcePacks) {
        resourcePacksData.push({
            value: pack.folderName,
            label: pack.manifest.displayName,
        })
    }

    return (
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
                    rightSection={<FontAwesomeIcon icon='chevron-down' />}
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

interface _TilePropertiesProps {
    level: Level;
    onChangeTile: LevelChangeTileHandler;
}

/**
 * The element that renders the entire "tile properties" section.
 * @returns 
 */
function _TileProperties ({
    level,
    onChangeTile,
}: _TilePropertiesProps) {
    const { getResourcePack } = useAppContext();
    const levelCtx = useLevelEditorContext();

    // if no tile is selected, this panel is not rendered.
    if (levelCtx.tileSelection.length === 0) return <></>;

    // when multiple tiles are selected, we can't edit their info yet.
    // TODO: Show only traits all targets have in common.
    if (levelCtx.tileSelection.length > 1) return (
        <Accordion.Item value={'target'}>
            <Accordion.Control>
                Target properties
            </Accordion.Control>
            <Accordion.Panel>
                <span>Multiple tile edition is not supported yet.</span>
            </Accordion.Panel>
        </Accordion.Item>
    );

    const pack = getResourcePack(level.resourcePack);
    if (pack === null) return (
        <Accordion.Item value={'target'}>
            <Accordion.Control>
                Target properties
            </Accordion.Control>
            <Accordion.Panel>
                <span>Select a valid resource pack to access properties.</span>
            </Accordion.Panel>
        </Accordion.Item>
    );

    // get the tile in the level currently selected.
    const tilePos = levelCtx.tileSelection[0];
    const levelTile = level.layers[levelCtx.activeTerrainLayer].tiles.find(
        t => vec2equals(t.position, tilePos)
    );
    // it should always find a tile, since selection is restricted to existing
    // tiles. If it doesn't, that's an error.
    if (levelTile === undefined) {
        console.error(
            `Couldn't find level tile at ${tilePos}, even though it's selected.`
        );
        return <></>;
    }

    // the tile info in the resource pack.
    const tile = pack.tiles.find(t => t.id === levelTile.tile);
    if (tile === undefined) {
        console.error(
            `Resource pack doesn't contain tile '${levelTile.tile}'.`
        );
        return <></>;
    }
    
    // each item has a key to ensure all nodes update when changing between
    // tiles of the same type
    return (
        <Accordion.Item
            key={vec2toString(tilePos)}
            classNames={{
                item: "item-properties",
            }}
            value={'target'}
        >
            <Accordion.Control>
                Properties for {tile.data.name} at {vec2toString(tilePos)}
            </Accordion.Control>
            <Accordion.Panel>
                {tile.data.traits.map(trait => getTraitSectionElement(levelTile, trait))}
            </Accordion.Panel>
        </Accordion.Item>
    );

    function handleTraitParamsChange (
        levelTile: LevelTile,
        traitId: TileTraitId,
        value: TraitParameterCollection
    ) {
        const update = {...levelTile.parameters};
        update[traitId] = value;

       onChangeTile(levelCtx.activeTerrainLayer, tilePos, 'parameters', update);
    }

    /**
     * Returns the element containing the section of the form for the trait given,
     * if that trait has any configurable parameter; or an empty element otherwise.
     * @param levelTile The level tile that contains the trait params to show.
     * @param trait The configuration of the trait by the respack's tile.
     * @returns 
     */
    function getTraitSectionElement (
        levelTile: LevelTile, trait: TileTraitDefinition
    ) : React.ReactNode {
        if (trait.configurableParameters.length > 0) {
            return <_TileTraitSection
                key={trait.name}
                trait={trait}
                traitId={trait.name}
                traitValues={levelTile.parameters[trait.name]!}
                onChangeTraitParameters={
                    v => handleTraitParamsChange(
                        levelTile,
                        trait.name,
                        v,
                    )
                }
            />
        }
        else {
            return <></>
        }
    }
}

interface _TileTraitSectionProps {
    trait: TileTraitDefinition;
    traitId: TileTraitId;
    traitValues: TraitParameterCollection;
    onChangeTraitParameters: (value: LevelTileParameterCollection) => void;
}

/**
 * The element in the form that contains the information about a specific trait:
 * the title of the section (which is the name of the trait) and all the fields
 * concerning that trait.
 */
function _TileTraitSection ({
    trait,
    traitId,
    traitValues,
    onChangeTraitParameters,
}: _TileTraitSectionProps) {
    const traitDef = TileTraits[trait.name];
    console.log(traitId, traitValues);

    return (
        <div className="trait-parameter-section">
            <div className="header">{traitDef.displayName}</div>
            <div className="parameters">{
                trait.configurableParameters.map(cfgParam => <_TileParameterField
                    key={cfgParam}
                    traitDef={traitDef}
                    paramId={cfgParam}
                    //@ts-ignore
                    value={traitValues[cfgParam]}
                    onChange={v => handleChange(cfgParam, v)}
                />)
            }</div>
        </div>
    );

    function handleChange (paramName: string, value: any) {
        const update: TraitParameterCollection = {
            ...traitValues,
        };

        // @ts-ignore
        update[paramName] = value,

        onChangeTraitParameters(update);
    }
}

interface _TileParameterFieldProps<T> {
    traitDef: Trait<T>
    paramId: string;
    value: T
    onChange: (v: T) => void;
}

/**
 * An element that renders a single field containing the value of a specific
 * parameter in a specific trait. This field can be of any type.
 */
function _TileParameterField<T> ({
    traitDef,
    paramId,
    value,
    onChange,
}: _TileParameterFieldProps<T>) {
    const paramDef = traitDef.parameters[paramId as keyof T] as Parameter<any>;

    if (paramDef.type === 'boolean') {
        return <_BooleanProperty
            paramDef={paramDef}
            value={value as boolean}
            onChange={onChange as (v: boolean) => void}
        />
    }
    if (paramDef.type === 'integer') {
        return <_IntegerProperty
            paramDef={paramDef}
            value={value as number}
            onChange={onChange as (v: number) => void}
        />
    }

    return (
        <div>
            {/*paramDef.displayName*/}-
        </div>
    );
}

interface _BooleanPropertyProps<T> {
    paramDef: Parameter<boolean>;
    value: boolean;
    onChange: (v: boolean) => void;
}

function _BooleanProperty<T> ({
    paramDef,
    value,
    onChange,
}: _BooleanPropertyProps<T>) {

    return (
        <div className="property-container property-container-boolean">
            <TitledCheckbox
                label={paramDef.displayName}
                description={paramDef.description}
                checked={value}
                onChange={evt => onChange(evt.currentTarget.checked)}
            />
        </div>
    );
}

interface _IntegerPropertyProps {
    paramDef: Parameter<number>;
    value: number;
    onChange: (v: number) => void;
}

function _IntegerProperty ({
    paramDef,
    value,
    onChange,
}: _IntegerPropertyProps) {

    return (
        <div className="property-container property-container-number">
            <NumberInput
                label={paramDef.displayName}
                description={paramDef.description}
                value={value}
                onChange={evt => onChange(Number(evt))}
                allowDecimal={false}
            />
        </div>
    );
}

interface _LabelWithTooltipProps {
    name: string;
    description: string | null | undefined;
}

function _LabelWithTooltip ({
    name,
    description,
}: _LabelWithTooltipProps) {
    
    if (description) {
        return <div className="property-label">
            <span>{name}</span>
            <Tooltip label={description}>
                <FontAwesomeIcon icon='circle-question' />
            </Tooltip>
        </div>;
    }
    else {
        return <>{name}</>;
    }
}



export default LevelEditor_PropertiesPanel;

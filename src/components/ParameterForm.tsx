import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumberInput, Select, TextInput } from '@mantine/core';
import TileTraits, { TraitId, TraitParameterCollection } from 'data/TileTraits';
import TileOrEntityInput from 'elements/TileOrEntityInput';
import TitledCheckbox from 'elements/TitledCheckbox';
import { ResourcePack } from 'models/ResourcePack';
import { BlockRegenerationMode, ItemReference, Parameter, ParameterValueCollection, PlayerDamageType, RewardTypeParameter, TraitValueCollection } from 'models/splatform';
import { TraitSpecification } from 'models/splatform';
import React from 'react';

export interface ParameterFormProps<T extends TraitId> {
    pack: ResourcePack;
    /**
     * The traits to include in the form.
     */
    traits: TraitSpecification<T>[];
    /**
     * The values of the parameters of each trait.
     */
    traitValues: TraitValueCollection<T>;
}

/**
 * Renders a form with all the traits given.
 */
function ParameterForm<T extends TraitId> ({
    pack,
    traits,
    traitValues,
}: ParameterFormProps<T>) {
    return (
        <div className="parameter-form">
            {traits.map(t => getTraitSectionElement(t))}
        </div>
    );

    function getTraitSectionElement (trait: TraitSpecification<T>)
        : React.ReactNode
    {
        if (trait.configurableParameters.length <= 0) return <></>;
        
        const values = traitValues[trait.id];
        if (values === undefined) {
            console.error(`Couldn't find values for '${trait.id}'.`);
            return (<>
                There was an error while building a form for '{trait.id}'
            </>);
        }

        return <_TraitSection
            key={trait.id}
            pack={pack}
            trait={trait}
            paramValues={values}
        />
    }
}

interface _TraitSectionProps<T extends TraitId> {
    pack: ResourcePack;
    trait: TraitSpecification<T>;
    paramValues: ParameterValueCollection;
}

/**
 * The element inside the form that contains the information about a specific
 * trait: the title of the section (which is the name of the trait) and all the
 * fields concerning that trait.
 * @returns 
 */
function _TraitSection<T extends TraitId> ({
    pack,
    trait,
    paramValues,
}: _TraitSectionProps<T>) {
    const traitDef = TileTraits[trait.id];

    return (
        <div className="trait-parameter-section">
            <div className="header">{traitDef.displayName}</div>
            <div className="parameter">
                {trait.configurableParameters.map(cfgParam => <_TileParameterField
                    pack={pack}
                    param={traitDef.parameters[
                        cfgParam as keyof TraitParameterCollection
                    ] as Parameter<any>}
                    value={paramValues[cfgParam]}
                />)}
            </div>
        </div>
    );
}

interface _TileParameterFieldProps {
    pack: ResourcePack;
    param: Parameter<any>;
    value: any;
}

/**
 * An element that renders a single field containing the value of a specific
 * parameter in a specific trait. This field can be of any type.
 */
function _TileParameterField ({
    pack,
    param,
    value,
}: _TileParameterFieldProps) {
    function onChange (v: any) {

    }

    if (param.type === 'boolean') {
        return <_BooleanProperty
            param={param}
            value={value as boolean}
            onChange={onChange as (v: boolean) => void}
        />
    }
    if (param.type === 'integer') {
        return <_NumberProperty
            param={param}
            value={value as number}
            onChange={onChange as (v: number) => void}
            allowDecimals={false}
        />
    }
    if (param.type === 'float') {
        return <_NumberProperty
            param={param}
            value={value as number}
            onChange={onChange as (v: number) => void}
            allowDecimals={true}
        />
    }
    if (param.type === 'string') {
        return <_StringProperty
            param={param}
            value={value as string}
            onChange={onChange as (v: string) => void}
        />
    }
    if (param.type === 'tileReference') {
        return <_TileOrEntityProperty
            pack={pack}
            param={param}
            allowTiles
            allowEntities
            value={value as ItemReference}
            onChange={onChange as (v: ItemReference) => void}
        />
    }
    if (param.type === 'entityReference') {
        return <_TileOrEntityProperty
            pack={pack}
            param={param}
            allowEntities
            value={value as ItemReference}
            onChange={onChange as (v: ItemReference) => void}
        />
    }
    if (param.type === 'tileOrEntityReference') {
        return <_TileOrEntityProperty
            pack={pack}
            param={param}
            allowEntities
            value={value as ItemReference}
            onChange={onChange as (v: ItemReference) => void}
        />
    }
    if (param.type === 'playerDamageType') {
        return <_SelectProperty
            param={param}
            value={value as PlayerDamageType}
            options={[
                { value: 'regular', label: "Regular"},
                { value: 'fatal', label: "Fatal"},
            ]}
            onChange={onChange as (v: string) => void}
        />
    }
    if (param.type === 'rewardType') {
        return <_SelectProperty
            param={param}
            value={value as RewardTypeParameter}
            options={[
                { value: 'coin', label: "Coin"},
                { value: 'tile', label: "Tile"},
                { value: 'entity', label: "Entity"},
            ]}
            onChange={onChange as (v: string) => void}
        />
    }
    if (param.type === 'blockRegenerationMode') {
        return <_SelectProperty
            param={param}
            value={value as BlockRegenerationMode}
            options={[
                { value: 'time', label: "Time"},
                { value: 'offscreen', label: "Offscreen"},
            ]}
            onChange={onChange as (v: string) => void}
        />
    }

    return (
        <div className="property-container">
            {param.displayName}
        </div>
    );
}


interface _BooleanPropertyProps<T> {
    param: Parameter<boolean>;
    value: boolean;
    onChange: (v: boolean) => void;
}

function _BooleanProperty<T> ({
    param,
    value,
    onChange,
}: _BooleanPropertyProps<T>) {

    return (
        <div className="property-container property-container-boolean">
            <TitledCheckbox
                label={param.displayName}
                description={param.description}
                checked={value}
                onChange={evt => onChange(evt.currentTarget.checked)}
            />
        </div>
    );
}

interface _NumberPropertyProps {
    param: Parameter<number>;
    value: number;
    onChange: (v: number) => void;
    allowDecimals: boolean;
}

function _NumberProperty ({
    param,
    value,
    onChange,
    allowDecimals,
}: _NumberPropertyProps) {

    return (
        <div className="property-container property-container-number">
            <NumberInput
                label={param.displayName}
                description={param.description}
                value={value}
                onChange={evt => onChange(Number(evt))}
                allowDecimal={allowDecimals}
            />
        </div>
    );
}

interface _StringPropertyProps {
    param: Parameter<string>;
    value: string;
    onChange: (v: string) => void;
}

function _StringProperty ({
    param,
    value,
    onChange,
}: _StringPropertyProps) {

    return (
        <div className="property-container property-container-string">
            <TextInput
                label={param.displayName}
                description={param.description}
                value={value}
                onChange={evt => onChange(evt.currentTarget.value)}
            />
        </div>
    );
}

interface _SelectPropertyProps<T> {
    param: Parameter<string>;
    value: T;
    options: {value: T, label: string}[];
    onChange: (v: T) => void;
}

function _SelectProperty<T extends string> ({
    param,
    value,
    options,
    onChange,
}: _SelectPropertyProps<T>) {

    return (
        <div className="property-container property-container-string">
            <Select
                size='sm'
                label={param.displayName}
                description={param.description}
                data={options}
                value={value}
                onChange={v => { if (v) onChange(v as T)}}
                allowDeselect={false}
                rightSection={<FontAwesomeIcon icon='chevron-down' />}
            />
        </div>
    );
}

interface _TileOrEntityPropertyProps {    
    pack: ResourcePack;
    param: Parameter<string>;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    value: ItemReference;
    onChange: (v: ItemReference) => void;
}

function _TileOrEntityProperty ({
    pack,
    param,
    allowTiles = false,
    allowTileEntities = false,
    allowEntities = false,
    value,
    onChange,
}: _TileOrEntityPropertyProps) {
    return (
        <div className="property-container property-container-string">
            <TileOrEntityInput
                pack={pack}
                label={param.displayName}
                description={param.description}
                allowTiles={allowTiles}
                allowTileEntities={allowTileEntities}
                allowEntities={allowEntities}
                value={value}
            />
        </div>
    );
}

export default ParameterForm;

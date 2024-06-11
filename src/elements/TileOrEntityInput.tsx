import { Button, InputWrapper, InputWrapperProps, Modal, ScrollArea, Tabs, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataAssetMetadata, ResourcePack } from 'models/ResourcePack';
import { ItemReferenceType, ItemReferenceTypeValueArr, LevelObject, ParameterValueCollection, Reference, TileReference } from 'models/splatform';
import React, { useState } from 'react';
import TileImage from './TileImage';
import { Tile } from 'models/Tile';
import { getClassString } from 'utils';
import { getNewLevelTile } from 'models/Level';
import ParameterForm from 'components/ParameterForm';
import { TileTraitId, TraitId } from 'data/TileTraits';

const VALID_TYPES = ['tile', 'entity'];

export interface TileOrEntityInputProps extends InputWrapperProps {
    pack: ResourcePack;
    value: Reference | null | undefined;
    disabled?: boolean;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    onChangeValue?: (val: Reference) => void;
}

function TileOrEntityInput ({
    pack,
    value,
    disabled = false,
    allowTiles = false,
    allowTileEntities = false,
    allowEntities = false,
    onChangeValue,
    ...inputWrapperProps
}: TileOrEntityInputProps) {
    const [opened, {open, close}] = useDisclosure(false);

    return (
        <InputWrapper {...inputWrapperProps}>
            <Button
                variant='default'
                classNames={{
                    root: "sp-item-input-button",
                    inner: "sp-item-input-inner",
                    label: "sp-item-input-label",
                }}
                onClick={open}
                disabled={disabled}
            >
                {getValueElement()}
            </Button>

            <Modal
                size="75%"
                title="Select an item"
                centered
                opened={opened}
                onClose={close}
                classNames={{
                    root: "sp-modal-root sp-item-input-modal-root",
                    content: "sp-modal-content sp-item-input-content",
                    header: "sp-modal-header sp-item-input-header",
                    title: "sp-modal-title sp-item-input-title",
                    close: "sp-modal-close sp-item-input-close",
                    body: "sp-modal-body sp-item-input-body",
                }}
            >
                <_ItemPicker
                    pack={pack}
                    value={value}
                    allowTiles={allowTiles}
                    allowTileEntities={allowTileEntities}
                    allowEntities={allowEntities}
                    onChangeValue={handleValueChange}
                    closeForm={close}
                />
            </Modal>
        </InputWrapper>
    );

    function handleValueChange (value: Reference) {
        onChangeValue?.(value);
    }

    function getValueElement () {
        if (!value || value.type === null || value.object === null) {
            return <div className="plain-label">
                <Text size='sm' truncate='end'>No value</Text>
            </div>;
        }

        if (value.type === 'tile') {
            const tile = pack.tilesById[value.object.tileId];

            return <div className="label-with-image">
                <TileImage
                    className="label-image"
                    pack={pack}
                    tile={tile.data}
                />
                <div className="label-text">
                    <Text size='sm' truncate='end'>{tile.data.name}</Text>
                </div>
            </div>
        }
        else if (value.type === 'entity') {
            return <div>todo - {value.object.entityId}</div>
        }
    }
}

interface _ItemPickerProps {
    pack: ResourcePack;
    value: Reference | null | undefined;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    onChangeValue: (val: Reference) => void;
    closeForm: () => void;
}

function _ItemPicker ({
    pack,
    value,
    allowTiles = false,
    allowTileEntities = false,
    allowEntities = false,
    onChangeValue,
    closeForm,
}: _ItemPickerProps) {
    const [selectedValue, setSelectedValue] = useState(value);

    return (
        <Tabs
            defaultValue={'tiles'}
            // @ts-ignore - false syntax error.
            //onChange={userCtx.setActiveTab}
            classNames={{
                root: "sp-tab-root sp-item-picker-tab-root",
                list: "sp-tab-ribbon-list",
                tab: "sp-tab-ribbon-tab terrain-tabs-tab",
                tabLabel: "sp-tab-ribbon-tab-label",
                panel: "sp-tab-panel sp-item-picker-tab-panel",
            }}
        >
            <ScrollArea scrollbars='x' type='hover'>
                <Tabs.List>
                    <Tabs.Tab value={'tiles'}>Tiles</Tabs.Tab>
                    <Tabs.Tab value={'tile-entities'}>Tile entities</Tabs.Tab>
                    <Tabs.Tab value={'entities'}>Entities</Tabs.Tab>
                </Tabs.List>
            </ScrollArea>
            
            <div className="picker-container">
                <Tabs.Panel value='tiles'>
                    <_TilePicker
                        pack={pack}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        onSubmit={v => onSubmit(v)}
                    />
                </Tabs.Panel>
                <Tabs.Panel value='tile-entities'>
                    tent
                </Tabs.Panel>
                <Tabs.Panel value='entities'>
                    ent
                </Tabs.Panel>
                <div className="picker-parameters">
                    {getParameterForm()}
                </div>
            </div>

            <div className="sp-modal-bottom-ribbon">
                <Button variant='light'>
                    Cancel
                </Button>
                <Button color='blue'>
                    Select
                </Button>
            </div>
        </Tabs>
    );

    function getParameterForm () : React.ReactNode {
        if (selectedValue?.type === 'tile') {
            const tileRef = pack.tilesById[selectedValue.object.tileId];

            return (
                <ParameterForm
                    pack={pack}
                    traits={tileRef.data.traits}
                    traitValues={selectedValue.object.parameters}
                    onChangeTraitValues={
                        (traitId, v) => handleTileTraitParamsChange(traitId, v)
                    }
                />
            );
        }
    }

    function handleTileTraitParamsChange (
        traitId: TileTraitId, value: ParameterValueCollection
    ) {
        setSelectedValue((prevState) => {
            if (prevState?.type !== 'tile') return prevState;

            return {
                ...prevState,
                object: {
                    ...prevState.object,
                    parameters: {
                        ...prevState.object.parameters,
                        [traitId]: value,
                    },
                }
            };
        });
    }

    function onSubmit (value: Reference) {
        onChangeValue?.(value);
        closeForm();
    }
}

interface _TilePickerProps {
    pack: ResourcePack;
    value: Reference | null | undefined;
    onChange: (val: TileReference) => void;
    onSubmit: (val: TileReference) => void;
}

function _TilePicker ({
    pack,
    value,
    onChange,
    onSubmit,
}: _TilePickerProps) {

    return (
        <div className="tile-picker">
            {pack.tiles.map(t => <_TileIcon
                pack={pack}
                tile={t}
                selected={value?.type === 'tile' && value.object.tileId === t.id}
                onSelect={() => handleChange(t.data)}
                onSubmit={() => handleSubmit(t.data)}
            />)}
        </div>
    );

    function handleChange (tileDef: Tile) {
        // if the clicked tile is already selected, nothing is done.
        if (isTileAlreadySelected(tileDef, value)) {
            return;
        }

        onChange(createNewTile(tileDef));
    }

    function handleSubmit (tileDef: Tile) {
        // if the clicked tile is already selected, submit the current value.
        if (isTileAlreadySelected(tileDef, value)) {
            onSubmit(value);
        }

        onSubmit(createNewTile(tileDef));
    }

    function createNewTile (tileDef: Tile) : TileReference {
        if (value?.type === 'tile' && value.object.tileId === tileDef.id) {
            return value;
        }

        const tile: TileReference = {
            type: 'tile',
            object: getNewLevelTile(tileDef),
        };

        return tile;
    }

    function isTileAlreadySelected (tileDef: Tile, value: Reference | null | undefined)
        : value is TileReference
    {
        return value?.type === 'tile' && value.object.tileId === tileDef.id;
    }
}


interface _TileIconProps {
    pack: ResourcePack;
    tile: DataAssetMetadata<Tile>
    selected: boolean;
    onSelect: () => void;
    onSubmit: () => void;
}

function _TileIcon ({
    pack,
    tile,
    selected,
    onSelect,
    onSubmit,
}: _TileIconProps) {
    const className = getClassString(
        "sp-gallery-selectable-item",
        "tile-icon",
        selected && "selected",
    );

    return (
        <div
            className={className}
            onClick={() => onSelect()}
            onDoubleClick={() => onSubmit()}
        >
            <TileImage pack={pack} tile={tile.data} />
            <Text classNames={{root: "tile-icon-label"}} size='sm' truncate='end'>
                {tile.data.name}
            </Text>
        </div>
    );
}



export default TileOrEntityInput;

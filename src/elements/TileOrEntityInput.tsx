import { Button, InputWrapper, InputWrapperProps, Modal, ScrollArea, Tabs, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataAssetMetadata, ResourcePack } from 'models/ResourcePack';
import { ItemReference, ItemReferenceType, ItemReferenceTypeValueArr } from 'models/splatform';
import React, { useState } from 'react';
import TileImage from './TileImage';
import { Tile } from 'models/Tile';
import { getClassString } from 'utils';

const VALID_TYPES = ['tile', 'entity'];

export interface TileOrEntityInputProps extends InputWrapperProps {
    pack: ResourcePack;
    value: ItemReference | null | undefined;
    disabled?: boolean;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    onChangeValue?: (val: ItemReference) => void;
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
    value = {
        type: 'tile',
        id: "question_block",
    };

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
                    onChangeValue={v => onChangeValue?.(v)}
                />
            </Modal>
        </InputWrapper>
    );

    function handleValueChange (value: ItemReference) {
        
    }

    function getValueElement () {
        if (value === null || value === undefined) {
            throw "This function can only be called when `value` is not null";
        }

        if (value.type === null || value.id === null) {
            return <div className="plain-label">No value</div>;
        }

        if (value.type === 'tile') {
            const tile = pack.tilesById[value.id];

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
            return <div>todo - {value.id}</div>
        }
    }
}

/**
 * Given a string containing the value of an item reference (a string with the
 * format `<type>:<name>`), returns an object describing its value.
 * @param value 
 */
function getValueData (value: string) : ItemReference {
    const valueArr = value?.split(":") ?? [];

    if (valueArr.length < 2) return {
        type: null,
        id: null,
    };

    if (ItemReferenceTypeValueArr.includes(valueArr[0]) === false) return {
        type: null,
        id: null,
    };
    
    return {
        type: valueArr[0] as ItemReferenceType,
        id: valueArr[1],
    }
}

interface _ItemPickerProps {
    pack: ResourcePack;
    value: ItemReference;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    onChangeValue: (val: ItemReference) => void;
}

function _ItemPicker ({
    pack,
    value,
    allowTiles = false,
    allowTileEntities = false,
    allowEntities = false,
    onChangeValue,
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
                    <_TileItemPicker
                        pack={pack}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        onSubmit={v => onChangeValue(v)}
                    />
                </Tabs.Panel>
                <Tabs.Panel value='tile-entities'>
                    tent
                </Tabs.Panel>
                <Tabs.Panel value='entities'>
                    ent
                </Tabs.Panel>
                <div className="picker-properties">
                    
                </div>
            </div>

            <div className="sp-modal-bottom-ribbon">
                <Button variant='light'>
                    Cancel
                </Button>
                <Button>
                    Select
                </Button>
            </div>
        </Tabs>
    );
}

interface _TileItemPickerProps {
    pack: ResourcePack;
    value: ItemReference;
    onChange: (val: ItemReference) => void;
    onSubmit: (val: ItemReference) => void;
}

function _TileItemPicker ({
    pack,
    value,
    onChange,
    onSubmit,
}: _TileItemPickerProps) {

    return (
        <div className="tile-picker">
            {pack.tiles.map(t => <_TileIcon
                pack={pack}
                tile={t}
                selected={value.id === t.id}
                onSelect={() => onChange({
                    type: 'tile',
                    id: t.id,
                })}
                onSubmit={() => onSubmit({
                    type: 'tile',
                    id: t.id,
                })}
            />)}
        </div>
    );
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

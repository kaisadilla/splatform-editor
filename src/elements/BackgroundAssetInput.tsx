import { Button, InputProps, InputWrapper, InputWrapperProps, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from 'context/useAppContext';
import { MediaAssetMetadata, ResourcePack } from 'models/ResourcePack';
import React, { useId, useRef, useState } from 'react';
import { getClassString, isString } from 'utils';
import AssetInput, { AssetInputProps } from './AssetInput';

export interface BackgroundAssetInputProps extends InputWrapperProps {
    pack: ResourcePack | string | null;
    value: string;
    onSelectValue?: (val: string) => void;
}

function BackgroundAssetInput ({
    pack,
    value,
    onSelectValue,
    ...assetInputProps
}: BackgroundAssetInputProps) {
    const { getResourcePack } = useAppContext();
    const [opened, {open, close}] = useDisclosure(false);

    if (isString(pack)) {
        pack = getResourcePack(pack as string);
    }

    return (
        <AssetInput
            {...assetInputProps}
            value={value}
            disabled={pack === null}
            modalTitle="Select background"
            opened={opened}
            open={open}
            close={close}
        >
            <_BackgroundPicker
                pack={pack as ResourcePack}
                value={value}
                onSelectValue={handleSelectValue}
            />
        </AssetInput>
    );

    function handleSelectValue (val: string) {
        onSelectValue?.(val);
        close();
    }
}

interface _BackgroundPickerProps {
    pack: ResourcePack;
    value: string;
    onSelectValue?: (val: string) => void;
}

function _BackgroundPicker ({
    pack,
    value,
    onSelectValue,
}: _BackgroundPickerProps) {

    return (
        <div className="sp-background-picker">
            {pack.backgrounds.map(b => <_BackgroundImage
                metadata={b}
                selected={value === b.id}
                onSelect={() => onSelectValue?.(b.id)}
            />)}
        </div>
    );
}

interface _BackgroundImageProps {
    metadata: MediaAssetMetadata;
    selected: boolean;
    onSelect: () => void;
}

function _BackgroundImage ({
    metadata,
    selected,
    onSelect,
}: _BackgroundImageProps) {
    const className = getClassString(
        "sp-background-picker-image",
        selected && "selected",
    );

    return (
        <div className={className} onClick={() => onSelect()}>
            <div className="image-container">
                <img src={"asset://" + metadata.fullPath} />
            </div>
            <div className="image-name">
                {metadata.fileName}
            </div>
        </div>
    );
}



export default BackgroundAssetInput;

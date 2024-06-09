import { Button, InputProps, InputWrapper, InputWrapperProps, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from 'context/useAppContext';
import { MediaAssetMetadata, ResourcePack } from 'models/ResourcePack';
import React, { useId, useRef, useState } from 'react';
import { getClassString, isString } from 'utils';
import AssetInput, { AssetInputProps } from './AssetInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AudioPlayer from 'react-h5-audio-player';

export interface MusicAssetInputProps extends InputWrapperProps {
    pack: ResourcePack | string | null;
    value: string;
    onSelectValue?: (val: string) => void;
}

function MusicAssetInput ({
    pack,
    value,
    onSelectValue,
    ...assetInputProps
}: MusicAssetInputProps) {
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
            modalTitle="Select music"
            opened={opened}
            open={open}
            close={close}
        >
            <_MusicPicker
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

interface _MusicPickerProps {
    pack: ResourcePack;
    value: string;
    onSelectValue?: (val: string) => void;
}

function _MusicPicker ({
    pack,
    value,
    onSelectValue,
}: _MusicPickerProps) {
    const [playingMusic, setPlayingMusic] = useState(undefined as string | undefined);

    return (
        <div className="sp-music-picker">
            <div className="sp-music-gallery">
                {pack.music.map(m => <_MusicImage
                    metadata={m}
                    selected={value === m.id}
                    onSelect={() => onSelectValue?.(m.id)}
                    onPlay={() => handlePlay(m)}
                />)}
            </div>
            <div className="sp-music-player">
                <AudioPlayer
                    src={playingMusic}
                    loop={false}
                />
            </div>
        </div>
    );

    function handlePlay (music: MediaAssetMetadata) {
        setPlayingMusic("asset://" + music.fullPath);
    }
}

interface _MusicImageProps {
    metadata: MediaAssetMetadata;
    selected: boolean;
    onSelect: () => void;
    onPlay: () => void;
}

function _MusicImage ({
    metadata,
    selected,
    onSelect,
    onPlay,
}: _MusicImageProps) {
    const className = getClassString(
        "sp-music-picker-icon",
        selected && "selected",
    );

    return (
        <div className={className} onClick={() => onSelect()}>
            <div className="play-container">
                <FontAwesomeIcon
                    icon='circle-play'
                    onClick={handlePlay}
                />
            </div>
            <div className="music-name">
                {metadata.fileName}
            </div>
        </div>
    );

    function handlePlay (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        onPlay();
        evt.stopPropagation();
    }
}



export default MusicAssetInput;

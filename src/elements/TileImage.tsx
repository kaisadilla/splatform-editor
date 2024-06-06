import { RESOURCE_FOLDERS } from '_constants';
import { ResourcePack } from 'models/ResourcePack';
import { Tile } from 'models/Tile';
import React from 'react';
import { ImgProps } from 'types';
import { getClassString } from 'utils';

export interface TileImageProps extends ImgProps {
    pack: ResourcePack;
    tile: Tile | null | undefined;
    scale?: number;
    bordered?: boolean;
}

function TileImage ({
    pack,
    tile,
    scale = 1,
    bordered = false,
    src,
    className,
    ...imgProps
}: TileImageProps) {
    let imgSrc;

    if (tile) {
        imgSrc = getTileImagePath(pack, tile);
    }
    else {
        imgSrc = undefined;
    }

    const classStr = getClassString(
        "asset-tile-image",
        bordered && "bordered",
        className,
    )

    return (
        <img
            className={classStr}
            src={imgSrc}
            alt=""
            style={{
                width: 16 * scale,
                height: 16 * scale,
            }}
            {...imgProps}
        />
    );
}

export function getTileImagePath (pack: ResourcePack, tile: Tile) {
    const imgPath = pack.fullPath + "\\" + RESOURCE_FOLDERS.sprites.tiles
        + "\\" + tile.sprite + ".png";

    return "asset://" + imgPath;
}

export default TileImage;

import { RESOURCE_FOLDERS } from '_constants';
import { ResourcePack } from 'models/ResourcePack';
import { Tile } from 'models/Tile';
import React from 'react';
import { ImgProps } from 'types';
import { getClassString, isString } from 'utils';

export interface TileImageProps extends ImgProps {
    pack: ResourcePack;
    tile: Tile | string | null | undefined;
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

    if (isString(tile)) {
        tile = pack.tilesById[tile]?.data;
    }

    imgSrc = tile ? getTileImagePath(pack, tile) : undefined;

    className = getClassString(
        "asset-tile-image",
        bordered && "bordered",
        className,
    )

    return (
        <img
            className={className}
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
        + "\\" + tile.spritesheet + ".png";

    return "asset://" + imgPath;
}

export default TileImage;

import { ResourcePack } from 'models/ResourcePack';
import { Tile } from 'models/Tile';
import React from 'react';
import { ImgProps } from 'types';
import { getClassString } from 'utils';

export interface TileImageProps extends ImgProps {
    pack: ResourcePack;
    tile: Tile;
}

function TileImage ({
    pack,
    tile,
    src,
    className,
    ...imgProps
}: TileImageProps) {
    const imgPath = pack.fullPath + "\\sprites\\tiles\\" + tile.sprite + ".png";
    const imgSrc = "asset://" + imgPath;

    const classStr = getClassString(
        "tile-image",
        className,
    )

    return (
        <img
            className={classStr}
            src={imgSrc}
            alt=""
        />
    );
}

export default TileImage;

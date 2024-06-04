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
        const imgPath = pack.fullPath + "\\sprites\\tiles\\" + tile.sprite + ".png";
        imgSrc = "asset://" + imgPath;
    }
    else {
        imgSrc = undefined;
    }

    const classStr = getClassString(
        "tile-image",
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
        />
    );
}

export default TileImage;

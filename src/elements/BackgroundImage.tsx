import { RESOURCE_FOLDERS } from '_constants';
import { ResourcePack } from 'models/ResourcePack';
import React from 'react';
import { ImgProps } from 'types';
import { getClassString } from 'utils';

export interface BackgroundImageProps extends ImgProps {
    pack: ResourcePack;
    background: string | null | undefined;
}

function BackgroundImage ({
    pack,
    background,
    src,
    className,
    ...imgProps
}: BackgroundImageProps) {
    let imgSrc;

    if (background) {
        const imgPath = pack.fullPath + "\\" + RESOURCE_FOLDERS.backgrounds
            + "\\" + background + ".png";
        imgSrc = "asset://" + imgPath;
    }
    else {
        imgSrc = undefined;
    }

    const classStr = getClassString(
        "asset-background-image",
        className,
    )

    return (
        <img
            className={classStr}
            src={imgSrc}
            alt=""
            {...imgProps}
        />
    );
}

export default BackgroundImage;

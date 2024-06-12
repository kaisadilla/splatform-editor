import { RESOURCE_FOLDERS } from '_constants';
import { Entity } from 'models/Entity';
import { ResourcePack } from 'models/ResourcePack';
import React from 'react';
import { ImgProps } from 'types';
import { getClassString, isString } from 'utils';

export interface EntityImageProps extends ImgProps {
    pack: ResourcePack;
    entity: Entity | string | null | undefined;
    size?: number;
    bordered?: boolean;
    lookLeft?: boolean;
}

function EntityImage ({
    pack,
    entity,
    size = 16,
    bordered = false,
    lookLeft = false,
    src,
    className,
    ...imgProps
}: EntityImageProps) {
    let imgSrc;

    if (isString(entity)) {
        entity = pack.entitiesById[entity]?.data;
    }

    imgSrc = entity ? getEntityImagePath(pack, entity) : undefined;

    className = getClassString(
        "asset-entity-image",
        bordered && "bordered",
        className,
    );

    if (!entity) return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
            }}
        >

        </div>
    );
    
    // The amount of times, in each dimension, that the entity fits in this
    // container.
    //const tx = Math.floor(size / entity.spritesheet.sliceSize[0]);
    //const ty = Math.floor(size / entity.spritesheet.sliceSize[1]);
    //const multiplier = Math.max(Math.min(tx, ty), 2);
    const biggestDim = Math.max(...entity.spritesheet.sliceSize);
    const multiplier = biggestDim > size ? 1 : 2;
    // the size of the image is set to exactly the size of the first sprite by
    // two, which ensures all images only show the first sprite of the spritesheet.
    const imgX = entity.spritesheet.sliceSize[0] * multiplier;
    const imgY = entity.spritesheet.sliceSize[1] * multiplier;

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
            }}
        >
            <img
                src={imgSrc}
                alt=""
                {...imgProps}
                style={{
                    width: imgX,
                    height: imgY,
                    transform: `scaleX(${lookLeft ? "-1" : "1"})`
                }}
            />
        </div>
    );
}

export function getEntityImagePath (pack: ResourcePack, entity: Entity) {
    const imgPath = pack.fullPath + "\\" + RESOURCE_FOLDERS.sprites.entities
        + "\\" + entity.spritesheet.name + ".png";

    return "asset://" + imgPath;
}

export default EntityImage;

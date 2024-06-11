import { RESOURCE_FOLDERS } from '_constants';
import { Entity } from 'models/Entity';
import { ResourcePack } from 'models/ResourcePack';
import React from 'react';
import { ImgProps } from 'types';
import { getClassString, isString } from 'utils';

export interface EntityImageProps extends ImgProps {
    pack: ResourcePack;
    entity: Entity | string | null | undefined;
    maxSize?: number;
    bordered?: boolean;
}

function EntityImage ({
    pack,
    entity,
    maxSize = 16,
    bordered = false,
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
    )

    return (
        <div
            className={className}
            style={{
                width: 32,
                height: 32,
            }}
        >
            <img
                src={imgSrc}
                alt=""
                {...imgProps}
                style={{
                    width: 16,
                    height: 16,
                    transform: `scale(2, 2) translate(4px, 4px)` 
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

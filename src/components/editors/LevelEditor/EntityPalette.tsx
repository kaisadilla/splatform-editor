import EntityImage from 'elements/EntityImage';
import { Entity } from 'models/Entity';
import { DataAssetMetadata, ResourcePack } from 'models/ResourcePack';
import React from 'react';

export interface LevelEditor_EntityPaletteProps {
    pack: ResourcePack | null;
}

function LevelEditor_EntityPalette ({
    pack,
}: LevelEditor_EntityPaletteProps) {
    if (pack === null) {
        return <div className="info-panel">
            Select a resource pack to start editing this level.
        </div>;
    }

    const entitiesByGroup = {} as {[category: string]: DataAssetMetadata<Entity>[]};

    for (const entity of pack.entities) {
        const group = entity.data.category ?? "null";
        if (entitiesByGroup[group] === undefined) {
            entitiesByGroup[group] = [];
        }

        entitiesByGroup[group].push(entity);
    }

    return (
        <div>
            {pack.entities.map(e => <EntityImage pack={pack} entity={e.data} maxSize={32} />)}
        </div>
    );
}

export default LevelEditor_EntityPalette;

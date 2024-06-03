import { Accordion, ScrollArea, Tooltip } from '@mantine/core';
import { useAppContext } from 'context/useAppContext';
import TileImage from 'elements/TileImage';
import { DataAssetMetadata, ResourcePack } from 'models/ResourcePack';
import { Tile } from 'models/Tile';
import React from 'react';

export interface LevelEditor_TilesPaletteProps {
    pack: ResourcePack
}

function LevelEditor_TilesPalette ({
    pack,
}: LevelEditor_TilesPaletteProps) {
    const tilesByGroup = {} as {[category: string]: DataAssetMetadata<Tile>[]};

    for (const tile of pack.tiles) {
        const group = tile.data.category ?? "null";
        if (tilesByGroup[group] === undefined) {
            tilesByGroup[group] = [];
        }

        tilesByGroup[group].push(tile);
    }

    console.log(pack);

    return (
        <ScrollArea
            scrollbars='y'
            type='hover'
            classNames={{
                root: "tile-palette"
            }}
            scrollbarSize={16}
        >
            <Accordion
                classNames={{
                    root: "palette-root",
                    item: "palette-item sp-accordion-panel",
                    control: "palette-control sp-accordion-panel-control sp-small",
                    label: "sp-accordion-panel-label",
                    panel: "palette-panel sp-accordion-panel-panel",
                    content: "palette-panel-content"
                }}
                multiple
                defaultValue={Object.keys(tilesByGroup)}
            >
                {Object.keys(tilesByGroup).map(gr => (<Accordion.Item
                    key={gr}
                    value={gr}
                >
                    <Accordion.Control>
                        {gr}
                    </Accordion.Control>
                    <Accordion.Panel>
                        {tilesByGroup[gr].map(t => <_TileButton
                            key={t.baseName}
                            tile={t}
                            pack={pack}
                        />)}
                    </Accordion.Panel>
                </Accordion.Item>))}
            </Accordion>
        </ScrollArea>
    );
}

interface _TileButtonProps {
    pack: ResourcePack;
    tile: DataAssetMetadata<Tile>;
}

function _TileButton ({
    pack,
    tile,
}: _TileButtonProps) {

    return (
        <Tooltip label={tile.data.name}>
            <div className="tile-button">
                <TileImage
                    key={tile.baseName}
                    tile={tile.data}
                    pack={pack}
                />
            </div>
        </Tooltip>
    );
}


export default LevelEditor_TilesPalette;

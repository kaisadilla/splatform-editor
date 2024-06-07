import { Accordion, ScrollArea, Tooltip } from '@mantine/core';
import { useAppContext } from 'context/useAppContext';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import TileImage from 'elements/TileImage';
import { DataAssetMetadata, ResourcePack } from 'models/ResourcePack';
import { Tile } from 'models/Tile';
import React from 'react';
import { getClassString } from 'utils';

export interface LevelEditor_TilesPaletteProps {
    pack: ResourcePack | null;
}

function LevelEditor_TilesPalette ({
    pack,
}: LevelEditor_TilesPaletteProps) {
    const { selectedPaint, setSelectedPaint } = useLevelEditorContext();
    const { getResourcePack } = useAppContext();

    if (pack === null) {
        return <div className="info-panel">
            Select a resource pack to start editing this level.
        </div>;
    }

    const tilesByGroup = {} as {[category: string]: DataAssetMetadata<Tile>[]};

    for (const tile of pack.tiles) {
        const group = tile.data.category ?? "null";
        if (tilesByGroup[group] === undefined) {
            tilesByGroup[group] = [];
        }

        tilesByGroup[group].push(tile);
    }

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
                {Object.keys(tilesByGroup).sort().map(gr => (<Accordion.Item
                    key={gr}
                    value={gr}
                >
                    <Accordion.Control>
                        {gr}
                    </Accordion.Control>
                    <Accordion.Panel>
                        {tilesByGroup[gr].map(t => <_TileButton
                            key={t.baseName}
                            pack={pack}
                            tile={t}
                            selected={selectedPaint?.id === t.id}
                            onClick={() => selectPaint(t)}
                        />)}
                    </Accordion.Panel>
                </Accordion.Item>))}
            </Accordion>
        </ScrollArea>
    );
    
    function selectPaint (tile: DataAssetMetadata<Tile>) {
        setSelectedPaint({
            id: tile.id,
            object: tile.data,
        })
    }
}

interface _TileButtonProps {
    pack: ResourcePack;
    tile: DataAssetMetadata<Tile>;
    selected: boolean;
    onClick: () => void;
}

function _TileButton ({
    pack,
    tile,
    selected,
    onClick,
}: _TileButtonProps) {
    const classStr = getClassString(
        "tile-button",
        selected && "selected",
    );

    return (
        <Tooltip label={tile.data.name}>
            <div className={classStr} onClick={() => onClick()}>
                <TileImage
                    key={tile.baseName}
                    tile={tile.data}
                    pack={pack}
                    bordered
                />
            </div>
        </Tooltip>
    );
}


export default LevelEditor_TilesPalette;

import { Accordion, ScrollArea, Tooltip, Tabs } from '@mantine/core';
import { useAppContext } from 'context/useAppContext';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import TileImage from 'elements/TileImage';
import { DataAssetMetadata, ResourcePack } from 'models/ResourcePack';
import { Tile } from 'models/Tile';
import { RectangleTileComposite, TileComposite, UnitTileComposite } from 'models/TileComposite';
import React from 'react';
import { getClassString } from 'utils';

export interface LevelEditor_TilePaletteProps {
    pack: ResourcePack | null;
}

function LevelEditor_TilePalette ({
    pack,
}: LevelEditor_TilePaletteProps) {
    const { terrainPaint, setTerrainPaint } = useLevelEditorContext();

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

    const rectangleComps = pack.tileComposites.filter(
        t => t.data.compositeType === 'rectangle'
    ) as DataAssetMetadata<RectangleTileComposite>[];
    const unitComps = pack.tileComposites.filter(
        t => t.data.compositeType === 'unit'
    ) as DataAssetMetadata<UnitTileComposite>[];

    return (<Tabs
        defaultValue='tiles'
        classNames={{
            root: "sp-section-tab-root",
            list: "sp-section-tab-ribbon-list",
            tab: "sp-section-tab-ribbon-tab",
            tabLabel: "sp-section-tab-ribbon-tab-label",
            panel: "sp-section-tab-panel",
        }}
    >
        <Tabs.List>
            <Tabs.Tab
                value='tiles'
            >
                Tiles
            </Tabs.Tab>
            <Tabs.Tab
                value='tile-composites'
            >
                Smart brushes
            </Tabs.Tab>
        </Tabs.List>

        <div className="sp-section-tab-panel-container level-grid-feature-options">
            <Tabs.Panel value='tiles'>
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
                                key={t.id}
                                pack={pack}
                                tile={t}
                                selected={
                                    terrainPaint !== null
                                    && terrainPaint.type === 'tile'
                                    && terrainPaint.id === t.id
                                }
                                onClick={() => selectPaint(t)}
                            />)}
                        </Accordion.Panel>
                    </Accordion.Item>))}
                    
                </Accordion>
                </ScrollArea>
            </Tabs.Panel>
            <Tabs.Panel value='tile-composites'>
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
                    defaultValue={["free_form", "rectangle", "line", "unit"]}
                >

                    <Accordion.Item
                        value="rectangle"
                    >
                        <Accordion.Control>
                            Rectangles
                        </Accordion.Control>
                        <Accordion.Panel>
                            {rectangleComps.map(tc => <_RectangleCompositeButton
                                key={tc.id}
                                pack={pack}
                                composite={tc.data}
                                selected={
                                    terrainPaint !== null
                                    && terrainPaint.type === 'tile_composite'
                                    && terrainPaint?.id === tc.id
                                }
                                onClick={() => selectPaint(tc)}
                            />)}
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item
                        value="unit"
                    >
                        <Accordion.Control>
                            Units
                        </Accordion.Control>
                        <Accordion.Panel>
                            {unitComps.map(tc => <_UnitCompositeButton
                                key={tc.id}
                                pack={pack}
                                composite={tc.data}
                                selected={
                                    terrainPaint !== null
                                    && terrainPaint.type === 'tile_composite'
                                    && terrainPaint?.id === tc.data.id
                                }
                                onClick={() => selectPaint(tc)}
                            />)}
                        </Accordion.Panel>
                    </Accordion.Item>

                </Accordion>
                </ScrollArea>
            </Tabs.Panel>
        </div>
    </Tabs>);
    
    function selectPaint (paint: DataAssetMetadata<Tile | TileComposite>) {
        setTerrainPaint(paint.data);
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
        "sp-gallery-selectable-item",
        selected && "selected",
    );

    return (
        <Tooltip label={tile.data.name}>
            <div className={classStr} onClick={() => onClick()}>
                <TileImage
                    pack={pack}
                    tile={tile.data}
                    bordered
                />
            </div>
        </Tooltip>
    );
}

interface _RectangleCompositeButtonProps {
    pack: ResourcePack;
    composite: RectangleTileComposite;
    selected: boolean;
    onClick: () => void;
}

function _RectangleCompositeButton ({
    pack,
    composite,
    selected,
    onClick,
}: _RectangleCompositeButtonProps) {
    const classStr = getClassString(
        "composite-button",
        "rectangle-composite-button",
        "sp-gallery-selectable-item",
        selected && "selected",
    );

    const defTile = pack.tilesById[composite.tiles.default];
    const topLeftTile = pack.tilesById[composite.tiles.topLeft!] ?? defTile;
    const topTile = pack.tilesById[composite.tiles.top!] ?? defTile;
    const topRightTile = pack.tilesById[composite.tiles.topRight!] ?? defTile;
    const leftTile = pack.tilesById[composite.tiles.left!] ?? defTile;
    const centerTile = pack.tilesById[composite.tiles.center!] ?? defTile;
    const rightTile = pack.tilesById[composite.tiles.right!] ?? defTile;
    const bottomLeftTile = pack.tilesById[composite.tiles.bottomLeft!] ?? defTile;
    const bottomTile = pack.tilesById[composite.tiles.bottom!] ?? defTile;
    const bottomRightTile = pack.tilesById[composite.tiles.bottomRight!] ?? defTile;

    return (
        <Tooltip label={composite.name}>
            <div className={classStr} onClick={() => onClick()}>
                <div className="tile-row">
                    <TileImage
                        pack={pack}
                        tile={topLeftTile.data}
                    />
                    <TileImage
                        pack={pack}
                        tile={topTile.data}
                    />
                    <TileImage
                        pack={pack}
                        tile={topRightTile.data}
                    />
                </div>
                <div className="tile-row">
                    <TileImage
                        pack={pack}
                        tile={leftTile.data}
                    />
                    <TileImage
                        pack={pack}
                        tile={centerTile.data}
                    />
                    <TileImage
                        pack={pack}
                        tile={rightTile.data}
                    />
                </div>
                <div className="tile-row">
                    <TileImage
                        pack={pack}
                        tile={bottomLeftTile.data}
                    />
                    <TileImage
                        pack={pack}
                        tile={bottomTile.data}
                    />
                    <TileImage
                        pack={pack}
                        tile={bottomRightTile.data}
                    />
                </div>
            </div>
        </Tooltip>
    );
}

interface _UnitCompositeButtonProps {
    pack: ResourcePack;
    composite: UnitTileComposite;
    selected: boolean;
    onClick: () => void;
}

function _UnitCompositeButton ({
    pack,
    composite,
    selected,
    onClick,
}: _UnitCompositeButtonProps) {
    const classStr = getClassString(
        "composite-button",
        "unit-composite-button",
        "sp-gallery-selectable-item",
        selected && "selected",
    );

    return (
        <Tooltip label={composite.name}>
            <div className={classStr} onClick={() => onClick()}>
                {composite.shape.map((rowArr, x) => <div
                    key={x}
                    className="tile-row"
                >
                    {rowArr.map((t, y) => {
                        return <TileImage
                            key={y}
                            pack={pack}
                            tile={t}
                        />
                    })}
                </div>)}
            </div>
        </Tooltip>
    );
}

export default LevelEditor_TilePalette;

import { Graphics, Sprite } from "@pixi/react";
import { removePositionsFromTileList } from "components/editors/LevelEditor/calculations";
import { useLevelEditorContext } from "context/useLevelEditorContext";
import { useSettingsContext } from "context/useSettings";
import { getTileImagePath } from "elements/TileImage";
import { Level } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { BaseTexture, Rectangle, SCALE_MODES, Texture, Graphics as PixiGraphics } from "pixi.js";
import { useMemo } from "react";
import { Rect, Vec2, vec2equals, vec2toString } from "utils";

const NO_TINT_COLOR = 0xffffff;

export interface CanvasTileInfo {
    key: string;
    position: Vec2;
    texture: Texture;
    isSelected: boolean;
}
export default function useEditorCanvasDrawing (
    pack: ResourcePack,
    level: Level,
    tilesInCurrentStroke: Vec2[],
    currentView: Rect,
    canvasSize: Vec2,
) {
    const { width, height } = level.settings;

    const settings = useSettingsContext();
    const levelCtx = useLevelEditorContext();
    const zoom = levelCtx.getZoomMultiplier();
    const tileSize = 16 * zoom;

    const tileTextures = useMemo(buildTileTextures, [pack.folderName, pack.tiles]);

    const tiles = buildVisibleTileArray();

    const [$activeTiles, $tilesBehind, $tilesInfront] = useMemo(() => {
        const active = tiles.active.map(t => <Sprite
            key={t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={1}
            scale={zoom}
            tint={t.isSelected ? settings.cssVariables.highlightColors.default : NO_TINT_COLOR}
        />);

        const behind = tiles.behind.map(t => <Sprite
            key={t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={0.5}
            scale={zoom}
        />);

        const infront = tiles.infront.map(t => <Sprite
            key={t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={0.5}
            scale={zoom}
        />);

        return [active, behind, infront];
    }, [
        tilesInCurrentStroke,
        currentView,
        levelCtx.activeTerrainLayer,
        levelCtx.terrainTool,
        levelCtx.tileSelection,
        level.layers.length,
        zoom,
    ]);

    const $gridLines = <Graphics draw={drawGridLines} alpha={0.4} />

    return {
        /**
         * The tiles that are currently visible in the canvas.
         */
        $activeTiles,
        /**
         * Tiles that are currently visible, but de-emphasized, in the canvas.
         * They render as semi-transparent tiles and sohuld ideally be rendered
         * below the $tiles sprites.
         */
        $tilesBehind,
        $tilesInfront,
        $gridLines,
    };

    // #region Generating resources
    function buildTileTextures () {
        const dict = {} as {[key: string]: Texture};

        for (const tile of pack.tiles) {
          const anim = tile.data.animation;
          const slices = anim.slices ?? [1, 1];
          // a tile needs slicing if its sprite has more than one frame.
          const needsSlicing = slices[0] !== 1 || slices[1] !== 1;
              
            if (needsSlicing) {
                // select the first frame available
                const frame = anim.frame ?? anim.frames?.[0] ?? 0;
                const xFrame = frame % slices[0];
                const yFrame = Math.floor(frame / slices[0]);
                
                const baseTex = new BaseTexture(getTileImagePath(pack, tile.data));
                const tex = new Texture(baseTex, new Rectangle(xFrame * 16, yFrame * 16, 16, 16));
                tex.baseTexture.scaleMode = SCALE_MODES.NEAREST;

                dict[tile.id] = tex;
            }
            else {
                const tex = Texture.from(getTileImagePath(pack, tile.data));
                tex.baseTexture.scaleMode = SCALE_MODES.NEAREST;
                dict[tile.id] = tex;
            }
        }

        return dict;
    }
    // #endregion

    function buildVisibleTileArray () {
        if (true) { // todo: only for terrain view
            return generateTileSpritesForTerrainView();
        }
    }

    /**
     * Generates the sprites that paint the canvas with the visuals fitted for
     * the "terrain" section, when the selected tool is the brush.
     */
    function generateTileSpritesForTerrainView () {
        const tilesArr = [] as CanvasTileInfo[];
        const behindArr = [] as CanvasTileInfo[];
        const infrontArr = [] as CanvasTileInfo[];

        for (let i = 0; i < level.layers.length; i++) {
            const layer = level.layers[i];
            const isActiveLayer = i === levelCtx.activeTerrainLayer;

            // reference to the array tiles in this layer will be added to.
            let currentArr = tilesArr;
            if (i < levelCtx.activeTerrainLayer) currentArr = behindArr;
            if (i > levelCtx.activeTerrainLayer) currentArr = infrontArr;

            let layerTiles;

            // some tools (brush, rectangle and eraser) paint over tiles in the
            // active layer. In this case, we want to remove tiles in the level
            // that are being overwritten by these tools right now.
            if (isActiveLayer && _doesTerrainToolOverrideActiveLayer()) {
                layerTiles = removePositionsFromTileList(
                    level.layers[i].tiles,
                    tilesInCurrentStroke
                );
            }
            // some others don't replace any tiles, so culling is not necessary.
            else {
                layerTiles = level.layers[i].tiles;
            }

            for (const tile of layerTiles) {
                const tex = tileTextures[tile.tileId];

                if (!tex) {
                    console.warn(
                        `Couldn't find texture for '${tile.tileId}'`, tileTextures
                    );
                    continue;
                }

                const pos = {
                    x: (tile.position.x * tileSize) - currentView.left,
                    y: (tile.position.y * tileSize) - currentView.top,
                };

                const newTile: CanvasTileInfo = {
                    key: i.toString() + "," + vec2toString(tile.position),
                    position: pos,
                    texture: tex,
                    // this tile is selected if it's in the active layer and its
                    // position is in the tile selection array.
                    isSelected: isActiveLayer && levelCtx.tileSelection.findIndex(
                        p => vec2equals(p, tile.position)
                    ) !== -1
                }

                currentArr.push(newTile);
            }

            if (isActiveLayer === false) continue;
            if (levelCtx.paint === null) continue;

            if (levelCtx.terrainTool === 'brush') {
                for (const tile of tilesInCurrentStroke) {
                    const tex = tileTextures[levelCtx.paint.id];

                    if (!tex) {
                        console.warn(
                            `Couldn't find texture for '${levelCtx.paint.id}'`,
                            tileTextures
                        );
                        continue;
                    }

                    currentArr.push({
                        key: vec2toString(tile),
                        position: {
                            x: (tile.x * tileSize) - currentView.left,
                            y: (tile.y * tileSize) - currentView.top,
                        },
                        texture: tex,
                        isSelected: false,
                    });
                }
            }
        }

        return {active: tilesArr, behind: behindArr, infront: infrontArr};
    }

    /**
     * Assuming the current view is terrain, returns true if the tool currently
     * selected paints over the active layer. Tools that do that utilize the
     * `tilesInCurrentStroke` variable to store a list of tiles that are being
     * currently replaced.
     * @returns 
     */
    function _doesTerrainToolOverrideActiveLayer () {
        return levelCtx.terrainTool === 'brush'
            || levelCtx.terrainTool === 'rectangle'
            || levelCtx.terrainTool === 'eraser';
    }

    function drawGridLines (g: PixiGraphics) {
        const xFirst = 1 - (currentView.left) % tileSize; // + 1 for line alignment
        const yFirst = 0 - (currentView.top % tileSize);

        g.clear();
        g.beginFill(0xff3300);
        //g.lineStyle(1, 0xff3300, 0.5);
        g.lineStyle(1, 0x000000, 1);

        for (let x = xFirst; x < canvasSize.x; x += tileSize) {
            g.moveTo(x, 0);
            g.lineTo(x, canvasSize.y);
        }
        for (let y = yFirst; y < canvasSize.y; y += tileSize) {
            g.moveTo(0, y);
            g.lineTo(canvasSize.x, y);
        }

        g.endFill();
    };
}
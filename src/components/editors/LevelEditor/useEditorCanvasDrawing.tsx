import { Sprite } from "@pixi/react";
import { removePositionsFromTileList } from "components/editors/LevelEditor/calculations";
import { useLevelEditorContext } from "context/useLevelEditorContext";
import { getTileImagePath } from "elements/TileImage";
import { Level } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { BaseTexture, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { useMemo } from "react";
import { Rect, Vec2, vec2toString } from "utils";

export interface CanvasTileInfo {
    key: string;
    position: Vec2;
    texture: Texture;
}
export default function useEditorCanvasDrawing (
    pack: ResourcePack,
    level: Level,
    tilesInCurrentStroke: Vec2[],
    currentView: Rect,
) {
    const levelCtx = useLevelEditorContext();

    const tileTextures = useMemo(buildTileTextures, [pack.folderName, pack.tiles]);

    const tiles = buildVisibleTileArray();

    const [$activeTiles, $backgroundTiles] = useMemo(() => {
        const active = tiles.active.map(t => <Sprite
            key={t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={1}
            scale={1}
        />);

        const background = tiles.background.map(t => <Sprite
            key={t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={0.5}
            scale={1}
        />);

        return [active, background];
    }, [
        tilesInCurrentStroke,
        currentView,
        levelCtx.selectedTileLayer,
        levelCtx.selectedGridTool,
        level.layers.length,
    ]);

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
        $backgroundTiles,
    };

    // #region Generating resources
    function buildTileTextures () {
        const dict = {} as {[key: string]: Texture};

        for (const tile of pack.tiles) {
          const anim = tile.data.animation;
          // a tile needs slicing if its sprite has more than one frame.
          const needsSlicing = anim.slices[0] !== 1
              || anim.slices[1] !== 1;
              
            if (needsSlicing) {
                // select the first frame available
                const frame = anim.frame ?? anim.frames?.[0] ?? 0;
                const xFrame = frame % anim.slices[0];
                const yFrame = Math.floor(frame / anim.slices[0]);
                
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
        if (true) {
            return generateTilesForTerrainView();
        }
    }

    /**
     * Generates the sprites that paint the canvas with the visuals fitted for
     * the "terrain" section, when the selected tool is the brush.
     */
    function generateTilesForTerrainView () {

        const tilesArr = [] as CanvasTileInfo[];
        const backgroundTilesArr = [] as CanvasTileInfo[];

        for (let i = 0; i < level.layers.length; i++) {
            const layer = level.layers[i];
            const isActiveLayer = i === levelCtx.selectedTileLayer;

            // reference to the array tiles in this layer will be added to.
            const currentArr = isActiveLayer ? tilesArr : backgroundTilesArr;

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
                const tex = tileTextures[tile.tile];

                if (!tex) {
                    console.warn(
                        `Couldn't find texture for '${tile.tile}'`, tileTextures
                    );
                    continue;
                }

                currentArr.push({
                    key: i.toString() + "," + vec2toString(tile.position),
                    position: {
                        x: (tile.position.x * 16) - currentView.left,
                        y: (tile.position.y * 16) - currentView.top,
                    },
                    texture: tex,
                });
            }

            if (isActiveLayer === false) continue;
            if (levelCtx.selectedPaint === null) continue;

            if (levelCtx.selectedGridTool === 'brush') {
                for (const tile of tilesInCurrentStroke) {
                    const tex = tileTextures[levelCtx.selectedPaint.id];

                    if (!tex) {
                        console.warn(
                            `Couldn't find texture for '${levelCtx.selectedPaint.id}'`,
                            tileTextures
                        );
                        continue;
                    }

                    currentArr.push({
                        key: vec2toString(tile),
                        position: {
                            x: (tile.x * 16) - currentView.left,
                            y: (tile.y * 16) - currentView.top,
                        },
                        texture: tex,
                    });
                }
            }
        }

        return {active: tilesArr, background: backgroundTilesArr};
    }

    /**
     * Assuming the current view is terrain, returns true if the tool currently
     * selected paints over the active layer. Tools that do that utilize the
     * `tilesInCurrentStroke` variable to store a list of tiles that are being
     * currently replaced.
     * @returns 
     */
    function _doesTerrainToolOverrideActiveLayer () {
        return levelCtx.selectedGridTool === 'brush'
            || levelCtx.selectedGridTool === 'rectangle'
            || levelCtx.selectedGridTool === 'eraser';
    }
}
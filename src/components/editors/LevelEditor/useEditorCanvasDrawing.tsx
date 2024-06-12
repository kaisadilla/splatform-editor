import { Graphics, Sprite } from "@pixi/react";
import { Sprite as PixiSprite} from "pixi.js";
import { removePositionsFromTileList } from "components/editors/LevelEditor/calculations";
import { GridTool, useLevelEditorContext } from "context/useLevelEditorContext";
import { useSettingsContext } from "context/useSettings";
import { getEntityImagePath } from "elements/EntityImage";
import { getTileImagePath } from "elements/TileImage";
import { Level } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { BaseTexture, Rectangle, SCALE_MODES, Texture, Graphics as PixiGraphics, ColorMatrixFilter, RenderTexture } from "pixi.js";
import { useMemo } from "react";
import { Rect, Vec2, vec2equals, vec2toString } from "utils";

/**
 * The amount of pixels per unit in a level.
 */
const PIXELS_PER_CELL = 16;
/**
 * An array of tools that render a preview sprite when the user hovers over the
 * canvas while editing terrain.
 */
const TERRAIN_TOOLS_WITH_PREVIEW: GridTool[] = ['brush', 'rectangle', 'bucket'];
/**
 * An array of tools that render a preview sprite when the user hovers over the
 * canvas while editing spawns.
 */
const SPAWN_TOOLS_WITH_PREVIEW: GridTool[] = ['brush'];

const NO_TINT_COLOR = 0xffffff;

const ETHEREAL_FILTER = new ColorMatrixFilter();
ETHEREAL_FILTER.matrix = [
    1, 0, 0, 0, 0.25, 
    0, 1, 0, 0, 0.25, 
    0, 0, 1, 0, 0.25, 
    0, 0, 0, 1, 0
];

export interface CanvasSpriteInfo {
    key: string;
    position: Vec2;
    texture: Texture;
    scale: Vec2;
    isSelected: boolean;
}
export default function useEditorCanvasDrawing (
    pack: ResourcePack,
    level: Level,
    /**
     * The pixel position in the level where an object would be placed right now.
     */
    placePosition: Vec2 | null,
    tilesInCurrentStroke: Vec2[],
    currentView: Rect,
    canvasSize: Vec2,
    levelToCanvasPos: (levelPos: Vec2) => Vec2,
) {
    const { width, height } = level.settings;

    const settings = useSettingsContext();
    const levelCtx = useLevelEditorContext();
    const zoom = levelCtx.getZoomMultiplier();
    /**
     * The size of a level's unit (cell) in the canvas (in pixels).
     */
    const cellSizeInCanvas = PIXELS_PER_CELL * zoom;

    const tileTextures = useMemo(buildTileTextures, [pack.folderName, pack.tiles]);
    const entityTextures = useMemo(buildEntityTextures, [pack.folderName, pack.entities]);

    const $gridLines = <Graphics draw={drawGridLines} alpha={0.4} />
    const [$activeTiles, $tilesBehind, $tilesInfront] = useMemo(() => {
        const tiles = buildVisibleTileArray();

        const active = tiles.active.map(t => <Sprite
            key={"active," + t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={1}
            scale={zoom}
            tint={t.isSelected ? settings.cssVariables.highlightColors.default : NO_TINT_COLOR}
        />);

        const behind = tiles.behind.map(t => <Sprite
            key={"behind," + t.key}
            x={t.position.x}
            y={t.position.y}
            texture={t.texture}
            alpha={0.5}
            scale={zoom}
        />);

        const infront = tiles.infront.map(t => <Sprite
            key={"infront," + t.key}
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
        levelCtx.activeSection,
        levelCtx.activeTerrainLayer,
        levelCtx.terrainTool,
        levelCtx.tileSelection,
        level.layers.length,
        zoom,
    ]);
    const $spawns = useMemo(() => {
        const spawns = buildVisibleSpawnArray();
        console.log(spawns);

        const sprites = spawns.map(s => <Sprite
            key={s.key}
            x={s.position.x}
            y={s.position.y}
            texture={s.texture}
            alpha={1}
            scale={s.scale}
            tint={s.isSelected ? settings.cssVariables.highlightColors.default : NO_TINT_COLOR}
        />);

        return sprites;
    }, [
        tilesInCurrentStroke,
        currentView,
        levelCtx.spawnSelection,
        level.spawns.length,
        zoom,
    ]);
    const $hoveringPaint = generateHoveringPaint();

    return {
        $gridLines,
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
        $spawns,
        $hoveringPaint,
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

    function buildEntityTextures () {
        const dict = {} as {[key: string]: Texture};

        for (const entity of pack.entities) {
            const anim = entity.data.animations.default;
            const slices = entity.data.spritesheet.slices ?? [1, 1];
            const sliceSize = entity.data.spritesheet.sliceSize ?? [16, 16];
            // a tile needs slicing if its sprite has more than one frame.
            const needsSlicing = slices[0] !== 1 || slices[1] !== 1;
              
            if (needsSlicing) {
                // select the first frame available
                const frame = anim.frame ?? anim.frames?.[0] ?? 0;
                const xFrame = frame % slices[0];
                const yFrame = Math.floor(frame / slices[0]);
                
                const baseTex = new BaseTexture(getEntityImagePath(pack, entity.data));
                const tex = new Texture(
                    baseTex,
                    new Rectangle(
                        xFrame * sliceSize[0],
                        yFrame * sliceSize[1],
                        sliceSize[0],
                        sliceSize[1]
                    )
                );
                tex.baseTexture.scaleMode = SCALE_MODES.NEAREST;

                dict[entity.data.id] = tex;
            }
            else {
                const tex = Texture.from(getEntityImagePath(pack, entity.data));
                tex.baseTexture.scaleMode = SCALE_MODES.NEAREST;
                dict[entity.data.id] = tex;
            }
        }

        return dict;
    }
    // #endregion

    function buildVisibleTileArray () {
        if (levelCtx.activeSection === 'terrain') {
            return generateTileSprites(true);
        }
        else {
            return generateTileSprites(false);
        }
    }

    function buildVisibleSpawnArray () {
        return generateSpawnSprites();
    }

    /**
     * Generates the sprites that paint the canvas with the visuals fitted for
     * the "terrain" section, when the selected tool is the brush.
     * @param highlightActiveLayer If true, only the active layer will be highlighted.
     */
    function generateTileSprites (highlightActiveLayer: boolean) {
        const tilesArr = [] as CanvasSpriteInfo[];
        const behindArr = [] as CanvasSpriteInfo[];
        const infrontArr = [] as CanvasSpriteInfo[];

        for (let i = 0; i < level.layers.length; i++) {
            const isActiveLayer = (i === levelCtx.activeTerrainLayer)
                || (highlightActiveLayer === false);

            // reference to the array tiles in this layer will be added to.
            let currentArr = tilesArr;
            if (isActiveLayer === false) {
                if (i < levelCtx.activeTerrainLayer) currentArr = behindArr;
                if (i > levelCtx.activeTerrainLayer) currentArr = infrontArr;
            }

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

                const pos = levelToCanvasPos(tile.position);

                const newTile: CanvasSpriteInfo = {
                    key: i.toString() + "," + vec2toString(tile.position),
                    position: pos,
                    texture: tex,
                    scale: {x: zoom, y: zoom},
                    // this tile is selected if it's in the active layer and its
                    // position is in the tile selection array.
                    isSelected: isActiveLayer && levelCtx.tileSelection.findIndex(
                        p => vec2equals(p, tile.position)
                    ) !== -1
                }

                currentArr.push(newTile);
            }

            if (isActiveLayer === false) continue;
            if (levelCtx.terrainPaint === null) continue;

            if (levelCtx.terrainTool === 'brush') {
                for (const tile of tilesInCurrentStroke) {
                    const tex = tileTextures[levelCtx.terrainPaint.id];

                    if (!tex) {
                        console.warn(
                            `Couldn't find texture for '${levelCtx.terrainPaint.id}'`,
                            tileTextures
                        );
                        continue;
                    }

                    currentArr.push({
                        key: vec2toString(tile),
                        position: levelToCanvasPos(tile),
                        texture: tex,
                        scale: {
                            x: zoom,
                            y: zoom,
                        },
                        isSelected: false,
                    });
                }
            }
        }

        return {active: tilesArr, behind: behindArr, infront: infrontArr};
    }

    function generateSpawnSprites () {
        const arr = [] as CanvasSpriteInfo[];

        for (let i = 0; i < level.spawns.length; i++) {
            const spawn = level.spawns[i];
            const tex = entityTextures[spawn.entity.entityId];

            if (!tex) {
                console.warn(
                    `Couldn't find texture for '${spawn.entity.entityId}'`,
                    entityTextures
                );
                continue;
            }

            const canvasPos = levelToCanvasPos(spawn.position);
            const scale = { x: zoom, y: zoom };

            if (spawn.entity.orientation === 'left') {
                canvasPos.x += tex.width * zoom;
                scale.x = -scale.x;
            }

            const newEntity: CanvasSpriteInfo = {
                key: i + "," + spawn.entity.entityId + "," + vec2toString(spawn.position),
                position: canvasPos,
                texture: tex,
                scale: scale,
                isSelected: levelCtx.spawnSelection.includes(spawn.uuid),
            }

            arr.push(newEntity);
        }

        return arr;
    }

    function generateHoveringPaint () {
        if (placePosition === null) return <></>;

        const canvasPos = levelToCanvasPos(placePosition);

        if (levelCtx.activeSection === 'terrain') {
            return generateHoveringTerrainPaint(canvasPos);
        }
        if (levelCtx.activeSection === 'spawns') {
            return generateHoveringEntityPaint(canvasPos, true);
        }

        return <></>;
    }

    function generateHoveringTerrainPaint (canvasPos: Vec2) {
        // when no paint is selected, don't show anything.
        if (levelCtx.terrainPaint === null) return <></>;
        // when a tool that places tiles is not selected, don't show anything.
        if (TERRAIN_TOOLS_WITH_PREVIEW.includes(levelCtx.terrainTool) === false) {
            return <></>;
        }

        const tex = tileTextures[levelCtx.terrainPaint.id];
        if (tex === null) return <></>;
    
        const sprites = (<Sprite
            x={canvasPos.x}
            y={canvasPos.y}
            texture={tex}
            alpha={0.8}
            scale={zoom}
            filters={[ETHEREAL_FILTER]}
        />);

        return sprites;
    }

    function generateHoveringEntityPaint (canvasPos: Vec2, lookLeft: boolean) {
        if (levelCtx.entityPaint === null) return <></>;
        if (SPAWN_TOOLS_WITH_PREVIEW.includes(levelCtx.terrainTool) === false) {
            return <></>;
        }

        const tex = entityTextures[levelCtx.entityPaint.id];
        if (tex === null) return <></>;

        const pos = {
            x: canvasPos.x,
            y: canvasPos.y,
        };
        const scale = {
            x: zoom,
            y: zoom,
        }

        if (lookLeft) {
            pos.x += tex.width * zoom;
            scale.x = -scale.x;
        }
    
        const sprites = (<Sprite
            x={pos.x}
            y={pos.y}
            texture={tex}
            alpha={0.8}
            scale={scale}
            filters={[ETHEREAL_FILTER]}
        />);

        return sprites;
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
        const xFirst = 1 - (currentView.left) % cellSizeInCanvas; // + 1 for line alignment
        const yFirst = 0 - (currentView.top % cellSizeInCanvas);

        g.clear();
        g.beginFill(0xff3300);
        //g.lineStyle(1, 0xff3300, 0.5);
        g.lineStyle(1, 0x000000, 1);

        for (let x = xFirst; x < canvasSize.x; x += cellSizeInCanvas) {
            g.moveTo(x, 0);
            g.lineTo(x, canvasSize.y);
        }
        for (let y = yFirst; y < canvasSize.y; y += cellSizeInCanvas) {
            g.moveTo(0, y);
            g.lineTo(canvasSize.x, y);
        }

        g.endFill();
    };
}
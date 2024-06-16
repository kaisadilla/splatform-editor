import { CSS_VARIABLES } from "_constants";
import { useLevelEditorContext } from "context/useLevelEditorContext";
import { getTileImagePath } from "elements/TileImage";
import { Level, PlacedTile, TileLayer, getNewLevelTile } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { Tile } from "models/Tile";
import { Rectangle, Texture, Graphics as PixiGraphics, Renderer, Sprite, RenderTexture, BaseTexture, ICanvas, SCALE_MODES } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Rect, Vec2, getCssVariableValue, vec2equals, vec2toString } from "utils";
import { removePositionsFromTileList } from "components/editors/LevelEditor/calculations";
import useEditorCanvasDrawing from "./useEditorCanvasDrawing";
import useEditorCanvasElement from "./useEditorCanvasElement";
import { LevelChangeFieldHandler } from ".";
import { useAppContext } from "context/useAppContext";
import useEditorCanvasInteraction from "./useEditorCanvasInteraction";

/**
 * The pixels contained in a single unit in a Level. This is not affected by any
 * transformations in the canvas, such as zoom.
 */
const PIXELS_PER_UNIT = 16;

export interface CanvasTileInfo {
    key: string;
    position: Vec2;
    texture: Texture;
}

export default function useEditorCanvas (
    pack: ResourcePack,
    level: Level,
    onChangeField: LevelChangeFieldHandler,
) {
    const { width, height } = level.settings;

    const appCtx = useAppContext();
    const levelCtx = useLevelEditorContext();
    const zoom = levelCtx.getZoomMultiplier();
    /**
     * The size of a tile in canvas pixels. At zoom 2, for example, the size
     * is 32x32, instead of 16x16.
     */
    const canvasTileSize = PIXELS_PER_UNIT * zoom;

    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);
    // the location in the canvas where the mouse currently is.
    const [mouseLocation, setMouseLocation] = useState<Vec2 | null>(null);
    // the position in the level (in pixels) where an element would be placed
    // right now.
    const [placePosition, setPlacePosition] = useState<Vec2 | null>(null);
    // the tile in the grid pointed at by the mouse.
    const [hoveredTile, setHoveredTile] = useState<Vec2 | null>(null);

    // the tiles being placed by this stroke, that will be added to the level
    // once the stroke is finished.
    const [currentStroke, setCurrentStroke] = useState([] as PlacedTile[]);
    // the positions being affected by this stroke, used for things that need
    // positions but don't place tiles, such as the eraser tool.
    const [currentPosStroke, setCurrentPosStroke] = useState([] as Vec2[]);

    const {
        viewboxRef,
        scrollareaRef,
        currentView,
        canvasSize,
        canvas,
        $horizRule,
        $vertRule,
        setCanvas,
        handleScroll,
    } = useEditorCanvasElement(pack, level);
    const drawing = useEditorCanvasDrawing(
        pack,
        level,
        placePosition,
        currentStroke,
        currentPosStroke,
        currentView,
        canvasSize,
        levelToCanvasPos,
    );

    const interaction = useEditorCanvasInteraction(
        pack,
        level,
        canvas,
        btnDown,
        placePosition,
        currentStroke,
        currentPosStroke,
        onChangeField,
        setCurrentStroke,
        setCurrentPosStroke,
        getTileAtPos,
        windowToLevelPos,
        canvasToLevelPixelPos
    );

    useEffect(() => {
        const f = (evt: PointerEvent) => handlePointerUp(evt);
        // 'mouseup' is added to the entire window because the user may release
        // the mouse while outside the canvas.
        document.addEventListener('pointerup', f);
        return () => {
            document.removeEventListener('pointerup', f);
        };
    }, [btnDown, currentStroke, currentPosStroke, levelCtx]);

    return {
        /**
         * A reference to the fixed-size outer (viewbox) div container.
         */
        viewboxRef,
        /**
         * A reference to the variable-size inner (scrollarea) div container.
         */
        scrollareaRef,
        /**
         * The size of the stage (HTML canvas).
         */
        canvasSize,
        /**
         * The current viewable area of the tilemap. Defines the topmost pixel
         * within the tilemap that is visible, and the width and height (in tilemap
         * pixels) that can be viewed from there.
         */
        currentView,
        /**
         * The horizontal ruler components.
         */
        $horizRule,
        /**
         * The vertical ruler components.
         */
        $vertRule,
        /**
         * An element that draws the grid.
         */
        $gridLines: drawing.$gridLines,
        /**
         * The tiles in the currently active layer, for rendering purposes. Note
         * that this doesn't necessarily correspond to the "active layer" in the
         * terrain tab - for example, when editing entity tiles, all tile layers
         * are considered inactive, while editing spawns considers all tile layers
         * active for rendering purposes.
         */
        $activeTiles: drawing.$activeTiles,
        /**
         * The tiles behind the active layer. Should be drawn before it.
         */
        $tilesBehind: drawing.$tilesBehind,
        /**
         * The tiles in front of the active layer. Should be drawn on top of it.
         */
        $tilesInfront: drawing.$tilesInfront,
        /**
         * Spawns.
         */
        $spawns: drawing.$spawns,
        /**
         * A sample of the paint currently selected, when appropriate, at the
         * position it would be placed if the user clicked at that moment. Should
         * be painted on top of everything else.
         */
        $hoveringPaint: drawing.$hoveringPaint,
        setCanvas,
        /**
         * Handles interaction when the user clicks down into the canvas.
         */
        handlePointerDown,
        /**
         * Handles interaction when the user drags his mouse around the canvas.
         */
        handlePointerMove,
        /**
         * Handles interactions when the user's pointer leaves the canvas.
         */
        handlePointerLeave,
        /**
         * Handles interaction when the user scrolls the canvas scrollable object.
         */
        handleScroll,
    };

    // #region handlers

    function handlePointerDown (evt: React.PointerEvent<HTMLCanvasElement>) {
        if (evt.buttons === 1) {
            setBtnDown('left');
        }
        else if (evt.buttons === 2) {
            setBtnDown('right');
        }

        interaction.onPointerDown(evt);
    }

    function handlePointerMove (evt: React.PointerEvent<HTMLCanvasElement>) {
        calculateHoverPositions(evt.clientX, evt.clientY);

        interaction.onPointerMove(evt);
    }

    function handlePointerUp (evt: PointerEvent) {
        setBtnDown(null);

        interaction.onPointerUp(evt);
    }

    function handlePointerLeave (evt: React.PointerEvent<HTMLCanvasElement>) {
        setMouseLocation(null);
        setPlacePosition(null);
        setHoveredTile(null);
    }
    // #endregion

    // #region Canvas interactions
    /**
     * Fills in the variables that hold information about where the user is
     * currently pointing at with their mouse.
     * @param x The x position in the canvas.
     * @param y The y position in the canvas.
     */
    function calculateHoverPositions (x: number, y: number) {
        setMouseLocation({x, y});
        setHoveredTile(windowToLevelPos(x, y, false));

        if (levelCtx.activeSection === 'spawns') {
            const gridPos = windowToLevelPos(x, y, true);

            if (gridPos === null) {
                setPlacePosition(null);
            }
            else {
                if (appCtx.isCtrlKeyPressed) {
                    setPlacePosition(gridPos);
                }
                else {
                    setPlacePosition(
                        snapPositionTo(gridPos, {x: .5, y: .5})
                    );
                }
            }
        }
        else {
            const gridPos = windowToLevelPos(x, y, false);
            setPlacePosition(gridPos);
        }
    }
    // #endregion

    // #region calculations
    /**
     * Given a pixel position in the window, returns the tile position in
     * the level that corresponds to that position.
     * @param x The x position in the window.
     * @param y The x position in the window.
     * @param allowDecimals If true, the position may not be an integer (e.g. 3.5),
     * if false, positions are floored to the nearest integer (e.g. 3.5 -> 3).
     * @returns The position in the tile grid, or null if the canvas is null.
     */
    function windowToLevelPos (
        x: number, y: number, allowDecimals: boolean
    ) : Vec2 | null {
        if (canvas === null) return null;
        const rect = canvas.getBoundingClientRect();

        if (allowDecimals) return snapPositionTo({
            x: (x - rect.left + currentView.left) / canvasTileSize,
            y: (y - rect.top + currentView.top) / canvasTileSize,
        }, {x: 1/16, y: 1/16});
        else return {
            x: Math.floor((x - rect.left + currentView.left) / canvasTileSize),
            y: Math.floor((y - rect.top + currentView.top) / canvasTileSize),
        };
    }

    function levelToCanvasPos (levelPos: Vec2) : Vec2 {
        return {
            x: (levelPos.x * canvasTileSize) - currentView.left,
            y: (levelPos.y * canvasTileSize) - currentView.top,
        };
    }

    /**
     * Given a pixel position in the canvas, returns the pixel in the level
     * that corresponds to that position.
     * @param x The x position in the canvas.
     * @param y The x position in the canvas.
     * @returns The pixel in the level at that position, or null if the canvas is null.
     */
    function canvasToLevelPixelPos (x: number, y: number) : Vec2 | null {
        if (canvas === null) return null;
        const rect = canvas.getBoundingClientRect();

        return {
            x: Math.floor((x - rect.left + currentView.left) / zoom),
            y: Math.floor((y - rect.top + currentView.top) / zoom),
        };
    }

    /**
     * Snaps the given position in relation to the snap grid given.
     * @param pos The position to snap.
     * @param snapGrid A vector that represents the spacing between valid points
     * to snap to. A snapGrid of (16, 16) would snap all values between 0 and 15
     * to 0, and values between 16 and 31 to 16.
     */
    function snapPositionTo (pos: Vec2, snapGrid: Vec2) {
        return {
            x: Math.floor(pos.x / snapGrid.x) * snapGrid.x,
            y: Math.floor(pos.y / snapGrid.y) * snapGrid.y,
        }
    }

    function getTileAtPos (layerIndex: number, pos: Vec2) : PlacedTile | null {
        return level.layers[levelCtx.activeTerrainLayer].tiles.find(
            t => vec2equals(t.position, pos)
        ) ?? null;
    }

    // #endregion
}
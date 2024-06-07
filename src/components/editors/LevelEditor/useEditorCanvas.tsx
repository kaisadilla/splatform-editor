import { CSS_VARIABLES } from "_constants";
import { useLevelEditorContext } from "context/useLevelEditorContext";
import { getTileImagePath } from "elements/TileImage";
import { Level, LevelTile, TileLayer } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { Tile } from "models/Tile";
import { Rectangle, Texture, Graphics as PixiGraphics, Renderer, Sprite, RenderTexture, BaseTexture, ICanvas, SCALE_MODES } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Rect, Vec2, getCssVariableValue, vec2equals, vec2toString } from "utils";
import { removePositionsFromTileList } from "components/editors/LevelEditor/calculations";
import useEditorCanvasDrawing from "./useEditorCanvasDrawing";
import useEditorCanvasElement from "./useEditorCanvasElement";

export interface CanvasTileInfo {
    key: string;
    position: Vec2;
    texture: Texture;
}

export default function useEditorCanvas (
    pack: ResourcePack,
    level: Level,
    onChangeField: (field: keyof Level, val: any) => void,
) {
    const { width, height } = level.settings;

    const levelCtx = useLevelEditorContext();

    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);

    // the tiles being placed by this stroke, that will be added to the level
    // once the stroke is finished.
    const [tilesInCurrentStroke, setTilesInCurrentStroke] = useState([] as Vec2[]);

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
        pack, level, tilesInCurrentStroke, currentView, canvasSize
    );

    useEffect(() => {
        const f = (evt: PointerEvent) => handlePointerUp(evt);
        // 'mouseup' is added to the entire window because the user may release
        // the mouse while outside the canvas.
        document.addEventListener('pointerup', f);
        return () => {
            document.removeEventListener('pointerup', f);
        };
    }, [btnDown, tilesInCurrentStroke, levelCtx]);

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
         * An element that draws the grid.
         */
        $gridLines: drawing.$gridLines,
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
         * Handles interaction when the user scrolls the canvas scrollable object.
         */
        handleScroll,
    };

    // #region handlers

    function handlePointerDown (evt: React.PointerEvent<HTMLCanvasElement>) {
        const tool = levelCtx.selectedGridTool;

        if (evt.buttons === 1) {
            setBtnDown('left');
            if (tool === 'select') {

            }
            else if (tool === 'brush' || tool == 'eraser') {
                registerPlaceTileClickAt({
                    x: evt.clientX,
                    y: evt.clientY,
                });
            }
            else if (tool === 'rectangle') {

            }
            else if (tool === 'bucket') {

            }
            else if (tool === 'picker') {

            }
        }
        else if (evt.buttons === 2) {
            setBtnDown('right');
        }
    }

    function handlePointerMove (masterEvt: React.PointerEvent<HTMLCanvasElement>) {
        const tool = levelCtx.selectedGridTool;
        const coalescedEvts = masterEvt.nativeEvent.getCoalescedEvents();

        if (btnDown === 'left') {
            if (tool === 'select') {

            }
            if (tool === 'brush' || tool === 'eraser') {
                const newPoints = [] as Vec2[]; // raw click pixel coords.
        
                for (const evt of coalescedEvts) {
                    if (btnDown === 'left') {
                        newPoints.push({
                            x: evt.clientX,
                            y: evt.clientY,
                        });
                    }
                }
                
                registerPlaceTileClickAt(...newPoints);
            }
            else if (tool === 'rectangle') {

            }
            else if (tool === 'bucket') {

            }
            else if (tool === 'picker') {

            }
        }
    }

    function handlePointerUp (evt: PointerEvent) {
        if (btnDown === 'left') {
                    
            if (levelCtx.selectedGridTool === 'brush') {
                addDrawnTiles();
            }
            else if (levelCtx.selectedGridTool === 'eraser') {
                removeDrawnTiles();
            }
        }

        setBtnDown(null);
    }
    // #endregion

    // #region Canvas interactions
    function registerPlaceTileClickAt (...positions : Vec2[]) {
        if (canvas === null) return [];
        if (levelCtx.selectedPaint === null) return;

        setTilesInCurrentStroke(prevState => {
            const rect = canvas.getBoundingClientRect();
            const placedTiles = [] as Vec2[];

            for (const pixelPos of positions) {
                const tilePos = {
                    x: Math.floor((pixelPos.x - rect.left + currentView.left) / 16),
                    y: Math.floor((pixelPos.y - rect.top + currentView.top) / 16),
                };
    
                if (prevState.find(lt => vec2equals(lt, tilePos))) {
                    continue;
                }
                if (placedTiles.find(pt => vec2equals(pt, tilePos))) {
                    continue;
                }
    
                placedTiles.push(tilePos);
            }

            return [
                ...prevState,
                ...placedTiles,
            ];
        });
    }

    function addDrawnTiles () {
        if (levelCtx.selectedPaint === null) return;

        let layerTiles = removePositionsFromTileList(
            level.layers[levelCtx.selectedTileLayer].tiles,
            tilesInCurrentStroke
        );

        const addedPositions = new Set<string>();
        for (const t of tilesInCurrentStroke) {
            if (addedPositions.has(vec2toString(t))) {
                continue;
            }
            else {
                addedPositions.add(vec2toString(t));
            }

            layerTiles.push({
                position: t,
                tile: levelCtx.selectedPaint.id,
            })
        }

        const update: TileLayer[] = [...level.layers];
        update[levelCtx.selectedTileLayer] = {
            ...update[levelCtx.selectedTileLayer],
            tiles: layerTiles
        }

        onChangeField('layers', update);

        setTilesInCurrentStroke([]);
    }

    function removeDrawnTiles () {
        let layerTiles = removePositionsFromTileList(
            level.layers[levelCtx.selectedTileLayer].tiles,
            tilesInCurrentStroke
        );

        const update: TileLayer[] = [...level.layers];
        update[levelCtx.selectedTileLayer] = {
            ...update[levelCtx.selectedTileLayer],
            tiles: layerTiles
        }

        onChangeField('layers', update);

        setTilesInCurrentStroke([]);
    }

    // #endregion
}
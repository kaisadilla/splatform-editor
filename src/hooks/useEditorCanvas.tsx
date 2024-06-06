import { CSS_VARIABLES } from "_constants";
import { useLevelEditorContext } from "context/useLevelEditorContext";
import { getTileImagePath } from "elements/TileImage";
import { LevelTile } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { Tile } from "models/Tile";
import { Rectangle, Texture, Graphics as PixiGraphics, Renderer, Sprite, RenderTexture, BaseTexture, ICanvas } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Rect, Vec2, getCssVariableValue } from "utils";

export const RULER_WIDTH = 16;
export const SCROLL_WIDTH = 10;

export interface CanvasTileInfo {
    position: Vec2;
    texture: Texture;
}

export function useEditorCanvas (pack: ResourcePack, width: number, height: number) {
    const levelCtx = useLevelEditorContext();

    const viewboxRef = useRef<HTMLDivElement | null>(null);
    const scrollareaRef = useRef<HTMLDivElement | null>(null);

    const [viewBox, setViewBox] = useState(null as DOMRect | null);
    // currently unused
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({width: 1, height: 1});
    const [currentView, setCurrentView] = useState(new Rect(0, 0, 1, 1));
    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);

    // the tiles being placed by this stroke, that will be added to the level
    // once the stroke is finished.
    const [tilesInCurrentStroke, setTilesInCurrentStroke] = useState([] as Vec2[]);

    useEffect(() => {
        addEventListeners();
    }, []);

    // Respond to changes in the container's size.
    useEffect(() => {
        const observer = handleContainerResize();
        return () => observer?.disconnect();
    }, [viewboxRef.current]);

    // respond to changes in the dimensions of the viewbox, or the map itself.
    useEffect(() => {
        recalculateCanvasInfo();
    }, [viewBox, width, height]);

    const $horizRule = useMemo(buildHorizontalRuler, [width]);
    const $vertRule = useMemo(buildVerticalRuler, [height]);

    const tileTextures = useMemo(buildTileTextures, [pack.folderName, pack.tiles]);

    const visibleTiles = [] as CanvasTileInfo[];
    if (levelCtx.selectedPaint) {
        for (const t of tilesInCurrentStroke) {
            const tex = tileTextures[levelCtx.selectedPaint.id];
            
            if (!tex) {
                console.warn(`Couldn't find texture for '${levelCtx.selectedPaint.id}'`, tileTextures);
                continue;
            }

            visibleTiles.push({
                position: new Vec2(
                    (t.x * 16) - currentView.left,
                    (t.y * 16) - currentView.top,
                ),
                texture: tex,
            });
        }
    }

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
         * The position and dimensions of the tilemap canvas within the window.
         */
        viewBox,
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
         * Contains all the elements that form the horizontal ruler.
         */
        $horizRule,
        /**
         * Contains all the elements that form the vertical ruler.
         */
        $vertRule,
        /**
         * A dictionary of tile textures. Each key contains the id of a tile and
         * its value contains the texture for that tile.
         */
        tileTextures,
        /**
         * The tiles that are currently visible in the canvas.
         */
        visibleTiles,
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
    function addEventListeners () {
        // 'mouseup' is added to the entire window because the user may release
        // the mouse while outside the canvas.
        document.addEventListener('pointerup', handlePointerUp);
        return () => {
            document.removeEventListener('pointerup', handlePointerUp);
        };
    }

    function handleScroll (evt: React.UIEvent<HTMLDivElement, UIEvent>) {
        const div = evt.currentTarget;
        //const xMax = div.scrollWidth;
        //const yMax = div.scrollHeight;
        const xCurrent = div.scrollLeft;
        const yCurrent = div.scrollTop;

        recalculateView(xCurrent, yCurrent);
    }

    function handlePointerDown (evt: React.PointerEvent<HTMLCanvasElement>) {
        if (evt.buttons === 1) {
            setBtnDown('left');
            registerPlaceTileClickAt(new Vec2(evt.clientX, evt.clientY));
        }
        else if (evt.buttons === 2) {
            setBtnDown('right');
        }
    }

    function handlePointerMove (masterEvt: React.PointerEvent<HTMLCanvasElement>) {
        const coalescedEvts = masterEvt.nativeEvent.getCoalescedEvents();

        const newPoints = [] as Vec2[]; // raw click pixel coords.

        for (const evt of coalescedEvts) {
            if (btnDown === 'left') {
                newPoints.push(new Vec2(evt.clientX, evt.clientY));
            }
        }
        
        registerPlaceTileClickAt(...newPoints);
    }

    function handlePointerUp (evt: PointerEvent) {
        setBtnDown(null);
    }

    /**
     * If the viewbox reference exists, starts observing it to allow the canvas
     * to respond to any changes in the viewbox's size.
     * @returns The observer used for this functionality.
     */
    function handleContainerResize () {
        if (viewboxRef.current === null) return null;

        const observer = new ResizeObserver(() => {
            if (viewboxRef.current) {
                setViewBox(viewboxRef.current.getBoundingClientRect());

                const xCurrent = scrollareaRef.current?.scrollLeft ?? currentView.left;
                const yCurrent = scrollareaRef.current?.scrollTop ?? currentView.top;
                recalculateView(xCurrent, yCurrent);
            }
            else {
                console.warn("Couldn't obtain canvas container node.");
                setViewBox(null);
            }
        })
        observer.observe(viewboxRef.current);

        return observer;
    }
    //#endregion

    // #region technical calculations
    /**
     * Recalculates the canvas info according to its width, height, zoom, the
     * size of its container, etc.
     */
    function recalculateCanvasInfo () {
        // TODO: sometimes the last viewbox received becomes zero somehow, and
        // somehow `canvasSize` is still the real value for <Stage> but an
        // incorrect one for <Sprite(bg)>. This is a dirty temporal workaround.
        if (viewBox === null || viewBox.width === 0) return;

        let cWidth = viewBox.width - RULER_WIDTH - SCROLL_WIDTH;
        let cHeight = viewBox.height - RULER_WIDTH - SCROLL_WIDTH;

        cWidth = Math.min(width * 16, cWidth);
        cHeight = Math.min(height * 16, cHeight);

        setCanvasSize({width: cWidth, height: cHeight});
        recalculateView(currentView.left, currentView.top);
    }

    /**
     * Recalculates the part of the map that is visible according to the
     * topleft pixel that is currently in view in the container.
     * @param xTop 
     * @param yTop 
     */
    function recalculateView (xTop: number, yTop: number) {
        console.info("Recalculating view...");
        setCurrentView(
            new Rect(xTop, yTop, canvasSize.width, canvasSize.height)
        );
    }
    // #endregion

    // #region building elements
    /**
     * Builds the elements to form the horizontal ruler for this map.
     * @returns An array containing these elements.
     */
    function buildHorizontalRuler () {
        const arr = [];

        for (let x = 0; x < width; x++) {
            arr.push(<div key={x} className="ruler-item">{x}</div>);
        }

        return arr;
    }

    /**
     * Builds the elements to form the vertical ruler for this map.
     * @returns An array containing these elements.
     */
    function buildVerticalRuler () {
        const arr = [];

        for (let y = 0; y < height; y++) {
            arr.push(<div key={y} className="ruler-item">{y}</div>);
        }

        return arr;
    }
    // #endregion

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

                dict[tile.id] = tex;
            }
            else {
                const tex = Texture.from(getTileImagePath(pack, tile.data));
                dict[tile.id] = tex;
            }
        }

        return dict;
    }

    // #region Canvas interactions
    function registerPlaceTileClickAt (...positions : Vec2[]) {
        if (canvas === null) return [];

        const rect = canvas.getBoundingClientRect();
        const placedTiles = [] as Vec2[];

        for (const pixelPos of positions) {
            const tilePos = new Vec2(
                Math.floor((pixelPos.x - rect.left + currentView.left) / 16),
                Math.floor((pixelPos.y - rect.top + currentView.top) / 16),
            );

            if (tilesInCurrentStroke.find(lt => lt.equals(tilePos))) {
                continue;
            }
            if (placedTiles.find(pt => pt.equals(tilePos))) {
                continue;
            }

            placedTiles.push(tilePos);
        }

        setTilesInCurrentStroke(prevState => [
            ...prevState,
            ...placedTiles,
        ]);
    }
    // #endregion
}
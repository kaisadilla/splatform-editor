import { Level } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { useEffect, useMemo, useRef, useState } from "react";
import { Rect, Vec2 } from "utils";

export const RULER_WIDTH = 16;
export const SCROLL_WIDTH = 10;
export const SCROLL_HEIGHT = 10;
const VIEW_PADDING = 4;

export default function useEditorCanvasElement (
    pack: ResourcePack,
    level: Level,
) {
    const { width, height } = level.settings;

    const viewboxRef = useRef<HTMLDivElement | null>(null);
    const scrollareaRef = useRef<HTMLDivElement | null>(null);

    const [viewBox, setViewBox] = useState(null as DOMRect | null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({x: 1, y: 1} as Vec2);
    const [currentView, setCurrentView] = useState(new Rect(0, 0, 1, 1));

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


    return {
        viewboxRef,
        scrollareaRef,
        viewBox,
        canvas,
        canvasSize,
        currentView,
        $horizRule,
        $vertRule,
        setCanvas,
        handleScroll,
    }

    // #region Listeners
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

    // #region Technical calculations
    /**
     * Recalculates the canvas info according to its width, height, zoom, the
     * size of its container, etc.
     */
    function recalculateCanvasInfo () {
        // TODO: sometimes the last viewbox received becomes zero somehow, and
        // somehow `canvasSize` is still the real value for <Stage> but an
        // incorrect one for <Sprite(bg)>. This is a dirty temporal workaround.
        if (viewBox === null || viewBox.width === 0) return;

        let cWidth = viewBox.width - RULER_WIDTH - SCROLL_WIDTH - VIEW_PADDING;
        let cHeight = viewBox.height - RULER_WIDTH - SCROLL_HEIGHT - VIEW_PADDING;

        cWidth = Math.min(width * 16, cWidth);
        cHeight = Math.min(height * 16, cHeight);

        setCanvasSize({x: cWidth, y: cHeight});
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
            new Rect(xTop, yTop, canvasSize.x, canvasSize.y)
        );
    }

    function handleScroll (evt: React.UIEvent<HTMLDivElement, UIEvent>) {
        const div = evt.currentTarget;
        //const xMax = div.scrollWidth;
        //const yMax = div.scrollHeight;
        const xCurrent = div.scrollLeft;
        const yCurrent = div.scrollTop;

        recalculateView(xCurrent, yCurrent);
    }
    // #endregion

    // #region Generated components
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
}
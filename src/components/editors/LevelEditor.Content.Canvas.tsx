import { ScrollArea } from '@mantine/core';
import { Graphics, Sprite, Stage, Text } from '@pixi/react';
import { CSS_VARIABLES, RESOURCE_FOLDERS } from '_constants';
import { getBackgroundImagePath } from 'elements/BackgroundImage';
import { useEditorCanvas } from 'hooks/useEditorCanvas';
import { ResourcePack } from 'models/ResourcePack';
import { Texture } from 'pixi.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Rect, Vec2, getClassString, getCssVariableValue } from 'utils';
import { Graphics as PixiGraphics } from '@pixi/graphics';

// note: 'canvas' refers to the <Stage> element, and 'content canvas' refers
// to this entire component.

const RULER_WIDTH = 16;
const SCROLL_WIDTH = 10;

export interface _LevelEditor_Content_CanvasProps {
    pack: ResourcePack;
    width: number;
    height: number;
    background: string | null | undefined;
    className?: string;
}

function _LevelEditor_Content_Canvas ({
    pack,
    width,
    height,
    background,
    className,
}: _LevelEditor_Content_CanvasProps) {
    height = width;
    const viewboxRef = useRef<HTMLDivElement | null>(null);
    const scrollareaRef = useRef<HTMLDivElement | null>(null);
    const a = [];
    for (let x = 0; x < 500; x++) {
        for (let y = 0; y < 25; y++) {
            a.push(new Vec2(x, y));
        }
    }
    // the position of this component in relation to the whole window.
    const [viewBox, setViewBox] = useState(null as DOMRect | null);
    // the size of the canvas.
    const [canvasSize, setCanvasSize] = useState({width: 1, height: 1});
    // the part of the level that is currently visible (in pixels).
    const [currentView, setCurrentView] = useState(new Rect(0, 0, 1, 1));
    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);

    const [_temp, _setTemp] = useState<Vec2[]>(a);

    const [scrollTopLeft, setScrollTopLeft] = useState(new Vec2(0, 0));

    useEffect(() => {
        if (viewboxRef.current === null) return;

        const observer = new ResizeObserver(() => {
            if (viewboxRef.current) {
                setViewBox(viewboxRef.current.getBoundingClientRect());
            }
            else {
                console.warn("Couldn't obtain canvas container node.");
                setViewBox(null);
            }
        })
        observer.observe(viewboxRef.current);

        return () => {
            observer.disconnect();
        }
    }, [viewboxRef.current]);

    useEffect(() => {
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
    }, [viewBox]);

    const pixelWidth = useMemo(() => {
        return width * 16;
    }, [width]);

    const pixelHeight = useMemo(() => {
        return width * 16;
    }, [height]);

    const bgColor = useMemo(() => {
        getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0)
    }, []);

    const texBg = useMemo(() => {
        if (background) {
            return Texture.from(getBackgroundImagePath(pack, background));
        }
        else {
            return null;
        }
    }, [background]);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const classStr = getClassString(
        "level-grid-canvas",
        className,
    );

    const texture = useMemo(() => {
        return Texture.from("asset://" + pack.fullPath + "\\" + RESOURCE_FOLDERS.sprites.tiles + "\\ground_wooden.png");
    }, []);

    const $horizRule = [];
    const $vertRule = [];

    for (let i = 0; i < width; i++) {
        $horizRule.push(<div key={i} className="ruler-item">{i}</div>);
        $vertRule.push(<div key={i} className="ruler-item">{i}</div>);
    }

    const gridLines = (g: PixiGraphics) => {
        const xFirst = 1 - (currentView.left) % 16; // + 1 for line alignment
        const yFirst = 0 - (currentView.top % 16);

        g.clear();
        g.beginFill(0xff3300);
        g.lineStyle(1, 0xff3300, 0.5);

        for (let x = xFirst; x < canvasSize.width; x += 16) {
            g.moveTo(x, 0);
            g.lineTo(x, canvasSize.height);
        }
        for (let y = yFirst; y < canvasSize.height; y += 16) {
            g.moveTo(0, y);
            g.lineTo(canvasSize.width, y);
        }

        g.endFill();
    };

    const [tilesInView, setTilesInView] = useState<Vec2[]>([]);
    useEffect(() => {
        const arr = [];

        for (const t of _temp) {
            const pos = new Vec2(t.x * 16, t.y * 16);

            if (pos.x >= (currentView.left - 16) && pos.x < currentView.left + currentView.width) {
                if (pos.y >= (currentView.top - 16) && pos.y < currentView.top + currentView.height) {
                    arr.push(pos);
                }
            }
        }

        setTilesInView(arr);
    }, [currentView, _temp]);

    return (
        <div ref={viewboxRef} className="level-grid-canvas-viewbox">
            <div
                ref={scrollareaRef}
                className="level-grid-canvas-scrollarea"
                onScroll={handleScroll}
                //classNames={{
                //    root: "level-grid-canvas-scrollarea"
                //}}
                //scrollbars='xy'
                //type='auto'
            >
                <div className="level-grid-canvas">
                    <div className="ruler-edge">
                        
                    </div>
                    <div className="horizontal-ruler">
                        {$horizRule}
                    </div>
                    <div className="vertical-ruler">
                        {$vertRule}
                    </div>
                    <Stage
                        className="canvas-element"
                        width={canvasSize.width}
                        height={canvasSize.height}
                        options={{background: "#bbb"}}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                    >
                        {texBg && <Sprite
                            texture={texBg}
                            x={0}
                            y={0}
                            width={canvasSize.width}
                            height={canvasSize.height}
                        />}
                        {tilesInView.map(t => <Sprite
                            //key={[t.x, t.y]}
                            x={(t.x) - currentView.left}
                            y={(t.y) - currentView.top}
                            texture={texture}/>
                        )}
                        <Graphics draw={gridLines} />
                    </Stage>
                    <div className="vertical-scroll" />
                    <div className="horizontal-scroll" />
                </div>
            </div>
        </div>
    )

    function handleScroll (evt: React.UIEvent<HTMLDivElement, UIEvent>) {
        const div = evt.currentTarget;
        //const xMax = div.scrollWidth;
        //const yMax = div.scrollHeight;
        const xCurrent = div.scrollLeft;
        const yCurrent = div.scrollTop;

        recalculateView(xCurrent, yCurrent);
    }

    function handleMouseDown (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (evt.buttons === 1) {
            setBtnDown('left');
        }
        else if (evt.buttons === 2) {
            setBtnDown('right');
        }
    }

    function handleMouseMove (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (btnDown === 'left') {
            const canvas = evt.currentTarget;
            const rect = canvas.getBoundingClientRect();
            if (!rect) return;

            const pos = {
                x: evt.clientX - rect.left + currentView.left,
                y: evt.clientY - rect.top + currentView.top,
            }
            
            const tilePos = {x: Math.floor(pos.x / 16), y: Math.floor(pos.y / 16)};

            if (_temp.find(p => p.x === tilePos.x && p.y === tilePos.y)) return;
            _setTemp(prevState => [
                ...prevState,
                tilePos,
            ]);
        }
    }

    function handleMouseUp (evt: MouseEvent) {
        setBtnDown(null);
    }

    /**
     * Recalculates the part of the level that is visible according to the
     * topleft pixel that is currently in view in the container.
     * @param xTop 
     * @param yTop 
     */
    function recalculateView (xTop: number, yTop: number) {
        setCurrentView(
            new Rect(xTop, yTop, canvasSize.width, canvasSize.height)
        );
    }
}

function loadImage (path: string) : Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = "asset://" + path;
    });
}

export default _LevelEditor_Content_Canvas;

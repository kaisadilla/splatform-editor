import { ScrollArea } from '@mantine/core';
import { Sprite, Stage, Text } from '@pixi/react';
import { CSS_VARIABLES, RESOURCE_FOLDERS } from '_constants';
import { getBackgroundImagePath } from 'elements/BackgroundImage';
import { useEditorCanvas } from 'hooks/useEditorCanvas';
import { ResourcePack } from 'models/ResourcePack';
import { Texture } from 'pixi.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Vec2, getClassString, getCssVariableValue } from 'utils';

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
    const ref = useRef<HTMLDivElement | null>(null);

    const [viewBox, setViewBox] = useState(null as DOMRect | null);
    const [canvasSize, setCanvasSize] = useState({width: 1, height: 1});
    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);

    const [_temp, _setTemp] = useState<Vec2[]>([]);

    const [scrollTopLeft, setScrollTopLeft] = useState(new Vec2(0, 0));


    const [_inView, _setInView] = useState({xMin: 0, yMin: 0, xMax: 5, yMax: 5});

    useEffect(() => {
        if (ref.current === null) return;

        const observer = new ResizeObserver(() => {
            if (ref.current) {
                console.log("resize");
                setViewBox(ref.current.getBoundingClientRect());
            }
            else {
                console.warn("Couldn't obtain canvas container node.");
                setViewBox(null);
            }
        })
        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        }
    }, [ref.current]);

    useEffect(() => {
        // TODO: sometimes the last viewbox received becomes zero somehow, and
        // somehow `canvasSize` is still the real value for <Stage> but an
        // incorrect one for <Sprite(bg)>. This is a dirty temporal workaround.
        if (viewBox === null || viewBox.width === 0) return;

        let cWidth = viewBox.width - RULER_WIDTH - SCROLL_WIDTH;
        let cHeight = viewBox.height - RULER_WIDTH - SCROLL_WIDTH;

        cWidth = Math.min(width * 16, cWidth);
        cHeight = Math.min(height * 16, cHeight);

        console.log("SIZE: " + viewBox.width + ", " + viewBox.height);
        setCanvasSize({width: cWidth, height: cHeight});
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

    return (
        <div ref={ref} className="level-grid-canvas-viewbox">
            <div
                className="level-grid-canvas-scrollarea"
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
                        {_temp.map(t => <Sprite
                            key={[t.x, t.y]}
                            x={t.x * 16}
                            y={t.y * 16}
                            texture={texture}/>
                        )}
                    </Stage>
                    <div className="vertical-scroll" />
                    <div className="horizontal-scroll" />
                </div>
            </div>
        </div>
    )

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
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top,
            }
            
            const tilePos = {x: Math.floor(pos.x / 16), y: Math.floor(pos.y / 16)};

            if (_temp.find(p => p.x === tilePos.x && p.y === tilePos.y)) return;
            _setTemp(prevState => [
                ...prevState,
                tilePos,
            ]);
            const canvasRect = canvas.getBoundingClientRect();
            _setInView({
                xMin: (516 - canvasRect.left) / 16,
                xMax: (516 - canvasRect.left + 1542) / 16,
                yMin: (104 - canvasRect.top) / 16,
                yMax: (104 - canvasRect.top + 605) / 16,
            })
        }
    }

    function handleMouseUp (evt: MouseEvent) {
        setBtnDown(null);
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

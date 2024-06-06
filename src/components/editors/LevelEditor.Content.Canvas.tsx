import { ScrollArea, filterProps } from '@mantine/core';
import { Graphics, Sprite, Stage, Text } from '@pixi/react';
import { CSS_VARIABLES, RESOURCE_FOLDERS } from '_constants';
import { getBackgroundImagePath } from 'elements/BackgroundImage';
import { useEditorCanvas } from 'hooks/useEditorCanvas';
import { ResourcePack } from 'models/ResourcePack';
import { Application, ICanvas, Texture } from 'pixi.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Rect, Vec2, getClassString, getCssVariableValue } from 'utils';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { useLevelEditorContext } from 'context/useLevelEditorContext';

// note: 'canvas' refers to the <Stage> element, and 'content canvas' refers
// to this entire component.

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
    const levelCtx = useLevelEditorContext();

    const {
        viewboxRef,
        scrollareaRef,
        canvasSize,
        currentView,
        $horizRule,
        $vertRule,
        tileTextures,
        visibleTiles,
        setCanvas,
        handlePointerDown,
        handlePointerMove,
        handleScroll,
    } = useEditorCanvas(pack, width, height);

    // Retrieve the color value to use as background when no image background has been chosen.
    const backgroundColor = getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0);

    const texBg = useMemo(() => {
        if (background) {
            return Texture.from(getBackgroundImagePath(pack, background));
        }
        else {
            return null;
        }
    }, [background]);

    const classStr = getClassString(
        "level-grid-canvas",
        className,
    );

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
                        options={{background: backgroundColor}}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onMount={registerCanvas}
                    >
                        {texBg && <Sprite
                            texture={texBg}
                            x={0}
                            y={0}
                            width={canvasSize.width}
                            height={canvasSize.height}
                        />}
                        {visibleTiles.map(t => <Sprite
                            //key={[t.x, t.y]}
                            x={t.position.x}
                            y={t.position.y}
                            texture={t.texture}/>
                        )}
                        <Graphics draw={gridLines} />
                    </Stage>
                    <div className="vertical-scroll" />
                    <div className="horizontal-scroll" />
                </div>
            </div>
        </div>
    )

    function registerCanvas (app: Application<ICanvas>) {
        if (app.view instanceof HTMLCanvasElement) {
            setCanvas(app.view);
        }
        else {
            console.error("app.view is not an HTMLCanvasElement");
        }
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

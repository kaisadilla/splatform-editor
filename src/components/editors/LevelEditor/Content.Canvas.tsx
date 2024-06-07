import { ScrollArea, filterProps } from '@mantine/core';
import { Graphics, Sprite, Stage, Text } from '@pixi/react';
import { CSS_VARIABLES, RESOURCE_FOLDERS } from '_constants';
import { getBackgroundImagePath } from 'elements/BackgroundImage';
import { ResourcePack } from 'models/ResourcePack';
import { Application, ICanvas, SCALE_MODES, Texture } from 'pixi.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Rect, Vec2, getClassString, getCssVariableValue, vec2toString } from 'utils';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import { Level } from 'models/Level';
import useEditorCanvas from './useEditorCanvas';

// note: 'canvas' refers to the <Stage> element, and 'content canvas' refers
// to this entire component.

export interface LevelEditor_Content_CanvasProps {
    pack: ResourcePack;
    level: Level;
    onChangeField: (field: keyof Level, val: any) => void;
    className?: string;
}

function LevelEditor_Content_Canvas ({
    pack,
    level,
    onChangeField,
    className,
}: LevelEditor_Content_CanvasProps) {
    const levelCtx = useLevelEditorContext();

    const { background } = level.settings;

    const {
        viewboxRef,
        scrollareaRef,
        canvasSize,
        currentView,
        $horizRule,
        $vertRule,
        $backgroundTiles,
        $activeTiles,
        setCanvas,
        handlePointerDown,
        handlePointerMove,
        handleScroll,
    } = useEditorCanvas(pack, level, onChangeField);

    // Retrieve the color value to use as background when no image background has been chosen.
    const backgroundColor = getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0);

    const texBg = useMemo(() => {
        if (background) {
            const tex = Texture.from(getBackgroundImagePath(pack, background));
            //tex.baseTexture.scaleMode = SCALE_MODES.NEAREST;
            return tex;
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
        //g.lineStyle(1, 0xff3300, 0.5);
        g.lineStyle(1, 0x000000, 1);

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
                        options={{
                            background: backgroundColor
                        }}
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
                        {$backgroundTiles}
                        {$activeTiles}
                        {levelCtx.showGrid && <Graphics draw={gridLines} alpha={0.4} />}
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

export default LevelEditor_Content_Canvas;

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
import { useSettingsContext } from 'context/useSettings';

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
    const settings = useSettingsContext();
    const levelCtx = useLevelEditorContext();

    const { background } = level.settings;

    const {
        viewboxRef,
        scrollareaRef,
        canvasSize,
        $horizRule,
        $vertRule,
        $tilesBehind,
        $tilesInfront,
        $activeTiles,
        $gridLines,
        setCanvas,
        handlePointerDown,
        handlePointerMove,
        handleScroll,
    } = useEditorCanvas(pack, level, onChangeField);

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
                        width={canvasSize.x}
                        height={canvasSize.y}
                        options={{
                            background: settings.cssVariables.componentColorTheme.shade0,
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onMount={registerCanvas}
                    >
                        {texBg && <Sprite
                            texture={texBg}
                            x={0}
                            y={0}
                            width={canvasSize.x}
                            height={canvasSize.y}
                        />}
                        {$tilesBehind}
                        {$activeTiles}
                        {$tilesInfront}
                        {levelCtx.showGrid && $gridLines}
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

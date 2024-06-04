import { Stage, Text } from '@pixi/react';
import { CSS_VARIABLES } from '_constants';
import EditorCanvas from 'elements/EditorCanvas';
import { ResourcePack } from 'models/ResourcePack';
import React, { useEffect, useRef, useState } from 'react';
import { getClassString, getCssVariableValue } from 'utils';

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
    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const bgColor = getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            console.log("null :(");
            return;
        }
        
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;

        if (ctx === null) return;
        
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.lineTo(100, 100);
        ctx.stroke();
    }, []);

    setTimeout(() => console.log(canvasRef.current), 1002);

    const classStr = getClassString(
        "level-grid-canvas",
        className,
    );
    

    return (
        <canvas
            className={classStr}
            ref={canvasRef}
            width={width * 16}
            height={height * 16}
        />
    );
}

export default _LevelEditor_Content_Canvas;

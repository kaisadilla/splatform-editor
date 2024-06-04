import { Container, PixiRef, Stage } from '@pixi/react';
import { CSS_VARIABLES } from '_constants';
import React, { forwardRef, useEffect, useRef } from 'react';
import { getClassString, getCssVariableValue } from 'utils';

export interface EditorCanvasRef {
    current: HTMLCanvasElement | null;
}

export interface EditorCanvasProps {
    /**
     * The width, in tiles, of this map.
     */
    width: number;
    /**
     * The height, in tiles, of this map.
     */
    height: number;
    children?: React.ReactNode;
    className?: string;
}

export type Ref = HTMLCanvasElement;

function _EditorCanvas (
    {
        width,
        height,
        children,
        className,
    } : EditorCanvasProps,
    ref: any,
) {
    const bgColor = getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0);
    const uuid = crypto.randomUUID();

    return (
        <canvas
            ref={ref}
            width={width * 16}
            height={height * 16}
        />
    )

    //useEffect(() => {
    //    if (setCanvas) {
    //        setCanvas(document.getElementById(uuid) as HTMLCanvasElement);
    //    }
    //}, []);
//
    //const classStr = getClassString(
    //    className,
    //);
//
    //return (
    //    <Stage
    //        className={classStr}
    //        width={width * 16}
    //        height={height * 16}
    //        options={{background: bgColor}}
    //        onMouseDown={() => console.log("a")}
    //        onMouseEnter={(evt) => console.log(evt)}
    //        id={uuid}
    //    >
    //        {children}
    //    </Stage>
    //);
}

const EditorCanvas = forwardRef<HTMLCanvasElement, EditorCanvasProps>(_EditorCanvas);

export default EditorCanvas;
import { Sprite, Stage } from '@pixi/react';
import { CSS_VARIABLES, RESOURCE_FOLDERS } from '_constants';
import { ResourcePack } from 'models/ResourcePack';
import { Texture } from 'pixi.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Vec2, getClassString, getCssVariableValue } from 'utils';

export interface _LevelEditor_Content_CanvasProps {
    viewBox: DOMRect;
    pack: ResourcePack;
    width: number;
    height: number;
    background: string | null | undefined;
    className?: string;
}

function _LevelEditor_Content_Canvas ({
    viewBox,
    pack,
    width,
    height,
    background,
    className,
}: _LevelEditor_Content_CanvasProps) {
    const [btnDown, setBtnDown] = useState<'left' | 'right' | null>(null);
    const [_inView, _setInView] = useState({xMin: 0, yMin: 0, xMax: 5, yMax: 5});
    const [_temp, _setTemp] = useState<Vec2[]>([]);

    const bgColor = getCssVariableValue(CSS_VARIABLES.ComponentColorTheme0);

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

    return (
        <Stage
            width={width * 16}
            height={height* 16}
            options={{background: "#bbb"}}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
        >
            {_temp.filter(t => t.x > _inView.xMin && t.x < _inView.xMax && t.y > _inView.yMin && t.y < _inView.yMax)
                .map(t => <Sprite x={t.x * 16} y={t.y * 16} texture={texture}/>)}
        </Stage>
        //<canvas
        //    className={classStr}
        //    width={width * 16}
        //    height={height * 16}
        //    onMouseDown={handleMouseDown}
        //    onMouseMove={handleMouseMove}
        ///>
    );

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
            console.log(_inView);
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

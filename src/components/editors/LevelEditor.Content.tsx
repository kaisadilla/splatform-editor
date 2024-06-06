import { GridTool, useLevelEditorContext } from 'context/useLevelEditorContext';
import TileImage from 'elements/TileImage';
import { Level } from 'models/Level';
import { ResourcePack } from 'models/ResourcePack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from '@mantine/core';
import Toolbar, { ToolbarButton } from 'elements/Toolbar';
import { BlurFilter, TextStyle } from 'pixi.js';
import { Container, Sprite, Stage, Text } from '@pixi/react';
import { Vec2 } from 'utils';
import LevelEditor_Content_Canvas from './LevelEditor.Content.Canvas';
import BackgroundImage from 'elements/BackgroundImage';
import LevelEditor_Features from './LevelEditor.Features';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SP_ResizeHandle } from 'elements/resizablePanel';

export interface LevelEditor_ContentProps {
    pack: ResourcePack | null;
    level: Level;
    onChangeField: (field: keyof Level, val: any) => void;
}

function LevelEditor_Content ({
    pack,
    level,
    onChangeField,
}: LevelEditor_ContentProps) {
    if (pack === null) {
        return (
            <div className="level-content level-content-disabled" />
        );
    }

    return (
        <div className="level-content">
            <div className="level-grid-container">
                <_GridTools
                    pack={pack}
                    level={level}
                />
                <_GridCanvas
                    pack={pack}
                    level={level}
                    onChangeField={onChangeField}
                />
            </div>
        </div>
    );
}

interface _GridToolsProps {
    pack: ResourcePack;
    level: Level;
}

function _GridTools ({
    pack,
    level,
}: _GridToolsProps) {
    const levelCtx = useLevelEditorContext();

    const { selectedPaint } = useLevelEditorContext();

    const buttons: ToolbarButton<GridTool>[] = [
        {
            value: 'select',
            label: "Select",
            icon: 'arrow-pointer',
        },
        {
            value: 'brush',
            label: "Brush",
            icon: 'paintbrush',
        },
        {
            value: 'rectangle',
            label: "Rectangle",
            icon: 'expand',
        },
        {
            value: 'eraser',
            label: "Eraser",
            icon: 'eraser',
        },
        {
            value: 'bucket',
            label: "Paint bucket",
            icon: 'fill-drip',
        },
        {
            value: 'move',
            label: "Move",
            icon: 'up-down-left-right',
        },
        {
            value: 'picker',
            label: "Picker",
            icon: 'eye-dropper-empty',
        },
    ];

    return (
        <div className="level-grid-tools">
            <div className="selected-paint">
                <TileImage
                    pack={pack}
                    tile={selectedPaint?.object} 
                    scale={2}
                    bordered
                />
            </div>
            <Toolbar<GridTool>
                direction='vertical'
                selectedValue={levelCtx.selectedGridTool}
                onSelectButton={levelCtx.setSelectedGridTool}
                buttons={buttons}
            />
        </div>
    );
}

interface _GridCanvasProps {
    pack: ResourcePack;
    level: Level;
    onChangeField: (field: keyof Level, val: any) => void;
}

function _GridCanvas ({
    pack,
    level,
    onChangeField,
}: _GridCanvasProps) {
    const levelCtx = useLevelEditorContext();

    return (
        <PanelGroup
            className="level-grid-canvas-container"
            direction='vertical'
        >
            <Panel defaultSize={10}>
                <LevelEditor_Content_Canvas
                    className="level-grid-canvas"
                    pack={pack}
                    level={level}
                    onChangeField={onChangeField}
                />
            </Panel>
            <SP_ResizeHandle direction='vertical' />
            <Panel defaultSize={4}>
                <LevelEditor_Features
                    pack={pack}
                    level={level}
                    onChangeField={onChangeField}
                />
            </Panel>
        </PanelGroup>
    );
}


export default LevelEditor_Content;

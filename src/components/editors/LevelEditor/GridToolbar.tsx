import { GridTool, useLevelEditorContext } from 'context/useLevelEditorContext';
import Toolbar, { ToolbarButton } from 'elements/Toolbar';
import React from 'react';

export interface LevelEditor_GridToolbarProps {
    
}

function LevelEditor_GridToolbar (props: LevelEditor_GridToolbarProps) {
    const levelCtx = useLevelEditorContext();
    const activeTools = levelCtx.getSelectableGridTools();

    const buttons: ToolbarButton<GridTool>[] = [
        {
            value: 'select',
            label: "Select (M)",
            icon: 'arrow-pointer',
            show: true,
            disabled: activeTools.includes('select') === false,
        },
        {
            value: 'brush',
            label: "Brush (B)",
            icon: 'paintbrush',
            show: levelCtx.activeSection === 'terrain',
            disabled: activeTools.includes('brush') === false,
        },
        {
            key: "place",
            value: 'brush',
            label: "Place (B)",
            icon: 'location-dot',
            show: levelCtx.activeSection === 'spawns',
            disabled: activeTools.includes('brush') === false,
        },
        {
            value: 'rectangle',
            label: "Rectangle (R)",
            icon: 'expand',
            show: levelCtx.activeSection === 'terrain',
            disabled: activeTools.includes('rectangle') === false,
        },
        {
            value: 'eraser',
            label: "Eraser (E)",
            icon: 'eraser',
            show: true,
            disabled: activeTools.includes('eraser') === false,
        },
        {
            value: 'bucket',
            label: "Paint bucket (G)",
            icon: 'fill-drip',
            show: levelCtx.activeSection === 'terrain',
            disabled: activeTools.includes('bucket') === false,
        },
        {
            value: 'picker',
            label: "Picker (I)",
            icon: 'eye-dropper-empty',
            show: true,
            disabled: activeTools.includes('picker') === false,
        },
    ];

    return (
        <Toolbar<GridTool>
            direction='vertical'
            fallbackValue='select'
            selectedValue={levelCtx.terrainTool}
            onSelectButton={v => levelCtx.setTool(v ?? null)}
            buttons={buttons}
        />
    );
}

export default LevelEditor_GridToolbar;

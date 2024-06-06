import React from 'react';
import { PanelResizeHandle, PanelResizeHandleProps } from 'react-resizable-panels';
import { getClassString } from 'utils';

export interface SPResizeHandleProps extends PanelResizeHandleProps {
    direction: 'horizontal' | 'vertical',
}

export function SP_ResizeHandle ({
    direction,
    className,
    ...props
}: SPResizeHandleProps) {
    const classStr = getClassString(
        direction === 'horizontal' && "sp-resize-handle-horiz",
        direction === 'vertical' && "sp-resize-handle-vert",
        className,
    );

    return (
        <PanelResizeHandle className={classStr}>
            <div className="separator-handle-container">
                <div className="separator-handle" />
            </div>
        </PanelResizeHandle>
    );
}

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
        "sp-resize-handle-horiz",
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

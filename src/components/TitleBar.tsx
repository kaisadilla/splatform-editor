import { Menu } from '@mantine/core';
import DragRegion from 'elements/DragRegion';
import React from 'react';
import appIcon from "@assets/icons/32x32.png";
import MenuBar from './MenuBar';

export interface TitleBarProps {
    
}

function TitleBar (props: TitleBarProps) {

    return (
        <div className="title-bar">
            <div className="app-icon">
                <img src={appIcon} />
            </div>
            <MenuBar />
            <DragRegion className="drag-region">
                SPlatform.Editor
            </DragRegion>
        </div>
    );
}

export default TitleBar;

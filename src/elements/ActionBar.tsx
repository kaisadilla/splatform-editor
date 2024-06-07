import { ScrollArea, Tooltip } from '@mantine/core';
import { ImageIconCollection, ToolIcons1_5x, ToolIcons1x, ToolIcons2x, ToolIconsBig } from 'icons';
import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';

export interface ActionBarElement {
    type: 'button' | 'toggle' | 'separator',
}

export interface ActionBarButton extends ActionBarElement {
    type: 'button';
    label: string;
    icon: keyof ImageIconCollection;
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface ActionBarToggle extends ActionBarElement {
    type: 'toggle';
    label: string;
    icon: keyof ImageIconCollection;
    value: boolean;
    onToggle: (val: boolean) => void;
}

export interface ActionBarSeparator extends ActionBarElement {
    type: 'separator';
}

export interface ActionBarProps extends DivProps {
    elements: ActionBarElement[];
}

function ActionBar ({
    elements,
    className,
    ...divProps
}: ActionBarProps) {
    className = getClassString(
        "sp-action-bar-container",
        className,
    );

    return (
        <ScrollArea
            classNames={{root: "sp-action-bar"}}
            scrollbars='x'
            type='hover'
        >
            <div className={className}>
                {elements.map(el => {
                    if (el.type === 'button') return <_Button
                        {...el as ActionBarButton}
                    />
                    if (el.type === 'separator') return <_Separator
                        {...el as ActionBarSeparator}
                    />
                    if (el.type === 'toggle') return <_Toggle
                        {...el as ActionBarToggle}
                    />
                })}
            </div>
        </ScrollArea>
    );
}

function _Button ({
    label,
    icon,
    onClick
}: ActionBarButton) {

    return (
        <Tooltip label={label}>
            <button className="sp-button" onClick={onClick}>
                <img
                    srcSet={
                        ToolIcons1x[icon] + " 1x, " +
                        ToolIcons1_5x[icon] + " 1.5x, " +
                        ToolIcons2x[icon] + " 2x " +
                        ToolIconsBig[icon] + " 3x "
                    }
                />
            </button>
        </Tooltip>
    );
}

function _Separator ({
    
}: ActionBarSeparator) {

    return (
        <div className="sp-separator" />
    );
}

function _Toggle ({
    label,
    icon,
    value,
    onToggle,
}: ActionBarToggle) {
    const className = getClassString(
        "sp-button",
        value && "toggled",
    )

    return (
        <Tooltip label={label}>
            <button className={className} onClick={() => onToggle(!value)}>
                <img
                    srcSet={
                        ToolIcons1x[icon] + " 1x, " +
                        ToolIcons1_5x[icon] + " 1.5x, " +
                        ToolIcons2x[icon] + " 2x " +
                        ToolIconsBig[icon] + " 3x "
                    }
                />
            </button>
        </Tooltip>
    );
}


export default ActionBar;

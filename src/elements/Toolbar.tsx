import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mantine/core';
import { ToolIcons } from 'icons';
import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';

export interface ToolbarButton<T> {
    value: T;
    label: string;
    icon?: IconProp;
    imgSrc?: keyof ToolIcons;
    color?: string;
    onClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface ToolbarProps<T> extends DivProps {
    direction: 'horizontal' | 'vertical';
    buttons: ToolbarButton<T>[];
    selectedValue?: T;
    onSelectButton: (value: T) => void;
}

function Toolbar<T> ({
    direction,
    buttons,
    selectedValue,
    onSelectButton,
    className,
    ...divProps
}: ToolbarProps<T>) {
    const classStr = getClassString(
        "sp-toolbar",
        className,
    );

    return (
        <div className={classStr} {...divProps}>
            {buttons.map(b => {
                const style = {} as React.CSSProperties;
                if (b.color) style.color = b.color;

                return (
                    <Tooltip key={b.value as string} label={b.label} position='right' >
                        <button
                            className={getClassString(
                                "toolbar-button",
                                selectedValue === b.value && "selected"
                            )}
                            onClick={evt => {
                                onSelectButton(b.value)
                                b.onClick?.(evt);
                            }}
                        >
                            {b.icon && <FontAwesomeIcon
                                icon={b.icon}
                                size='lg'
                                style={style}
                            />}
                            {b.imgSrc && <img
                                src={b.imgSrc}
                                alt=""
                            />}
                        </button>
                    </Tooltip>
                );
            })}
        </div>
    );
}

export default Toolbar;

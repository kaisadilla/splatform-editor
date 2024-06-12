import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mantine/core';
import { ImageIconCollection } from 'icons';
import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';

export interface ToolbarButton<T> {
    key?: string;
    value: T;
    label: string;
    icon?: IconProp;
    imgSrc?: keyof ImageIconCollection;
    color?: string;
    /**
     * If false, this element won't show in the toolbar.
     */
    show?: boolean;
    disabled?: boolean;
    onClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface ToolbarProps<T> extends DivProps {
    direction: 'horizontal' | 'vertical';
    buttons: ToolbarButton<T>[];
    fallbackValue?: T;
    selectedValue?: T;
    onSelectButton: (value: T | undefined) => void;
}

function Toolbar<T> ({
    direction,
    buttons,
    fallbackValue,
    selectedValue,
    onSelectButton,
    className,
    ...divProps
}: ToolbarProps<T>) {
    const classStr = getClassString(
        "sp-toolbar",
        className,
    );

    const selectedButton = buttons.find(b => b.value === selectedValue);
    if (selectedButton?.disabled && selectedButton.value !== fallbackValue) {
        onSelectButton(fallbackValue);
    }

    return (
        <div className={classStr} {...divProps}>
            {buttons.filter(b => b.show !== false).map(b => {
                const style = {} as React.CSSProperties;
                if (b.color) style.color = b.color;

                return (
                    <Tooltip
                        key={b.key ?? b.value as string}
                        label={b.label}
                        position='right'
                    >
                        <button
                            className={getClassString(
                                "toolbar-button",
                                selectedValue === b.value && "selected"
                            )}
                            onClick={evt => {
                                onSelectButton(b.value)
                                b.onClick?.(evt);
                            }}
                            disabled={b.disabled ?? false}
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

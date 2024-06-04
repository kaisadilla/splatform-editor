import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mantine/core';
import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';

export interface ToolbarButton<T> {
    value: T;
    label: string;
    icon: IconProp;
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
            {buttons.map(b =>
                <Tooltip label={b.label} position='right' >
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
                    <FontAwesomeIcon icon={b.icon} size='lg' />
                </button>
                </Tooltip>)
            }
        </div>
    );
}

export default Toolbar;

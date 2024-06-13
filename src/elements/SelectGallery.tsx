import { Button, InputWrapper, InputWrapperProps } from '@mantine/core';
import React from 'react';
import { getClassString } from 'utils';

export interface SelectGalleryOptionData<T extends string> {
    key?: string;
    value: T;
    label: string;
}

export interface SelectGalleryProps<T extends string> extends InputWrapperProps {
    data: SelectGalleryOptionData<T>[];
    value: T;
    multipleSelection?: boolean;
    onSelectValue: (value: T) => void;
}

function SelectGallery<T extends string> ({
    data,
    value,
    onSelectValue,
    classNames,
    ...inputWrapperProps
}: SelectGalleryProps<T>) {
    const rootClassName = getClassString(
        "sp-select-gallery-root",
        // @ts-ignore
        classNames?.root,
    )

    return (
        <InputWrapper
            {...inputWrapperProps}
            classNames={{
                ...classNames,
                root: rootClassName,
            }}
        >
            <div className="sp-select-gallery-option-container">
                {data.map(d => <_ToggleButton
                    key={d.key ?? d.value}
                    data={d}
                    selected={value === d.value}
                    onClick={() => handleToggleValue(d.value)}
                />)}
            </div>
        </InputWrapper>
    );

    function handleToggleValue (selectedVal: T) {
        if (value !== selectedVal) {
            onSelectValue(selectedVal);
        }
    }
}

interface _ToggleButtonProps<T extends string> {
    data: SelectGalleryOptionData<T>;
    selected: boolean;
    onClick: () => void;
}

function _ToggleButton<T extends string> ({
    data,
    selected,
    onClick,
}: _ToggleButtonProps<T>) {

    return (
        <Button
            classNames={{root: "sp-select-gallery-button-root"}}
            variant={selected ? 'filled' : 'outline'}
            onClick={() => onClick()}
        >
            {data.label}
        </Button>
    );
}


export default SelectGallery;

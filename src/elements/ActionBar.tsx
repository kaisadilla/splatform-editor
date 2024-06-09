import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumberInput, NumberInputProps, ScrollArea, Select, SelectProps, Tooltip, useProps } from '@mantine/core';
import { ImageIconCollection, ToolIcons1_5x, ToolIcons1x, ToolIcons2x, ToolIconsBig } from 'icons';
import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';

export interface ActionBarElement {
    type: 'button' | 'toggle' | 'separator' | 'number' | 'custom' | 'select',
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

export interface ActionBarNumberInput extends ActionBarElement {
    type: 'number';
    label: string;
    tooltipLabel?: string;
    value: string | number;
    onChange: (val: string | number) => void;
    numberInputProps?: NumberInputProps;
}

export interface ActionBarSelectInput extends ActionBarElement {
    type: 'select';
    label: string;
    tooltipLabel?: string;
    value: string;
    onChange: (val: string) => void;
    selectProps?: SelectProps;
}

export interface ActionBarSeparator extends ActionBarElement {
    type: 'separator';
}

export interface ActionBarCustomElement extends ActionBarElement {
    type: 'custom';
    element: React.ReactNode;
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
                {elements.map((el, i) => {
                    if (el.type === 'button') return <_Button
                        key={i}
                        {...el as ActionBarButton}
                    />
                    if (el.type === 'separator') return <_Separator
                        key={i}
                        {...el as ActionBarSeparator}
                    />
                    if (el.type === 'toggle') return <_Toggle
                        key={i}
                        {...el as ActionBarToggle}
                    />
                    if (el.type === 'number') return <_NumberInput
                        key={i}
                        {...el as ActionBarNumberInput}
                    />
                    if (el.type === 'select') return <_SelectInput
                        key={i}
                        {...el as ActionBarSelectInput}
                    />
                    if (el.type === 'custom') return (
                        (el as ActionBarCustomElement).element
                    )
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

function _NumberInput ({
    label,
    tooltipLabel,
    value,
    onChange,
    numberInputProps = {},
}: ActionBarNumberInput) {
    const className = getClassString(
        "sp-input",
    );

    const $input = (
        <div className={className}>
            <NumberInput
                classNames={{
                    root: "sp-action-bar-input-root",
                    wrapper: "sp-action-bar-input-wrapper",
                    input: "sp-action-bar-input-input",
                    label: "sp-action-bar-input-label",
                }}
                label={label}
                value={value}
                onChange={onChange}
                size='xs'
                {...numberInputProps}
            />
        </div>
    )

    if (tooltipLabel) {
        return (
            <Tooltip label={tooltipLabel}>
                {$input}
            </Tooltip>
        );
    }
    else {
        return $input;
    }
}

function _SelectInput ({
    label,
    tooltipLabel,
    value,
    onChange,
    selectProps = {},
}: ActionBarSelectInput) {
    const className = getClassString(
        "sp-input",
    );

    const $input = (
        <div className={className}>
            <Select
                classNames={{
                    root: "sp-action-bar-input-root",
                    wrapper: "sp-action-bar-input-wrapper",
                    input: "sp-action-bar-input-input",
                    label: "sp-action-bar-input-label",
                }}
                label={label}
                value={value}
                onChange={v => {if (v) onChange(v)}}
                allowDeselect={false}
                size='xs'
                maxDropdownHeight={"70vh"}
                comboboxProps={{
                    size: 'sm',
                    offset: -1,
                }}
                {...selectProps}
            />
        </div>
    )

    if (tooltipLabel) {
        return (
            <Tooltip label={tooltipLabel}>
                {$input}
            </Tooltip>
        );
    }
    else {
        return $input;
    }
}

export default ActionBar;

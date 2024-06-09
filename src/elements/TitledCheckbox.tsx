import { Checkbox, CheckboxProps, InputWrapper } from '@mantine/core';
import React from 'react';

export interface TitledCheckboxProps extends CheckboxProps {
    /**
     * The labels to use for true and false values. By default these
     * are "True" and "False".
     */
    valueLabels?: [string, string];
}

function TitledCheckbox ({
    valueLabels = ["True", "False"],
    label,
    description,
    error,
    checked,
    ...checkboxProps
}: TitledCheckboxProps) {

    return (
        <InputWrapper
            label={label}
            description={description}
            error={error}
        >
            <Checkbox
                className="sp-titled-checkbox"
                label={checked ? valueLabels[0] : valueLabels[1]}
                checked={checked}
                error={error !== undefined}
                {...checkboxProps}
            />
        </InputWrapper>
    );
}

export default TitledCheckbox;

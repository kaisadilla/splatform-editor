import React from 'react';
import { Parameter } from 'models/splatform';
import _NumberField, { _NumberFieldProps } from './base/NumberField';

export interface FloatParameterProps {
    param: Parameter<number>;
    value: number;
    disabled?: boolean;
    onChange?: (v: number) => void;
}

function FloatParameter (props: FloatParameterProps) {

    return (
        <_NumberField
            {...props}
            allowDecimals={true}
        />
    );
}

export default FloatParameter;

import React from 'react';
import _NumberField, { _NumberFieldProps } from './base/NumberField';
import { Parameter } from 'models/splatform';

export interface IntegerParameterProps {
    param: Parameter<number>;
    value: number;
    onChange?: (v: number) => void;
}

function IntegerParameter (props: IntegerParameterProps) {

    return (
        <_NumberField
            {...props}
            allowDecimals={false}
        />
    );
}

export default IntegerParameter;

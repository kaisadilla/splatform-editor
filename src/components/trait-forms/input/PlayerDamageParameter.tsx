import { Parameter, PlayerDamageType } from 'models/splatform';
import _SelectField, { _SelectFieldProps } from './base/SelectField';
import React from 'react';

export interface PlayerDamageParameterProps {
    param: Parameter<PlayerDamageType>;
    value: PlayerDamageType;
    disabled?: boolean;
    onChange?: (v: PlayerDamageType) => void;
}

function PlayerDamageParameter ({
    param,
    value,
    disabled,
    onChange,
}: PlayerDamageParameterProps) {

    return (
        <_SelectField
            param={param}
            value={value}
            options={[
                { value: 'regular', label: "Regular"},
                { value: 'fatal', label: "Fatal"},
            ]}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default PlayerDamageParameter;

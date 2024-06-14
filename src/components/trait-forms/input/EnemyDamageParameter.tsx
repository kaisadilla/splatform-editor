import { EntityDamageType, Parameter } from 'models/splatform';
import _SelectField, { _SelectFieldProps } from './base/SelectField';
import React from 'react';

export interface EnemyDamageParameterProps {
    param: Parameter<EntityDamageType>;
    value: EntityDamageType;
    disabled?: boolean;
    onChange?: (v: EntityDamageType) => void;
}

function EnemyDamageParameter ({
    param,
    value,
    disabled,
    onChange,
}: EnemyDamageParameterProps) {

    return (
        <_SelectField
            param={param}
            value={value}
            options={[
                { value: 'none', label: "None"},
                { value: 'regular', label: "Regular"},
                { value: 'fatal', label: "Fatal"},
            ]}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default EnemyDamageParameter;

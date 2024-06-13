import { EntityDamageType, Parameter } from 'models/splatform';
import _SelectField, { _SelectFieldProps } from './base/SelectField';
import React from 'react';

export interface EnemyDamageParameterProps {
    param: Parameter<EntityDamageType>;
    value: EntityDamageType;
    onChange?: (v: EntityDamageType) => void;
}

function EnemyDamageParameter ({
    param,
    value,
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
            onChange={onChange}
        />
    );
}

export default EnemyDamageParameter;

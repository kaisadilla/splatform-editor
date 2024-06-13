import { Direction, Parameter } from 'models/splatform';
import _SelectField, { _SelectFieldProps } from './base/SelectField';
import React from 'react';
import SelectGallery from 'elements/SelectGallery';

export interface DirectionParameterProps {
    param: Parameter<Direction>;
    value: Direction;
    onChange?: (v: Direction) => void;
}

function DirectionParameter ({
    param,
    value,
    onChange,
}: DirectionParameterProps) {
    return (
        <SelectGallery<Direction>
            classNames={{root: "parameter-container parameter-container-direction"}}
            size='sm'
            label="Orientation"
            description="The direction this entity starts looking at."
            data={[
                { value: 'up', label: "Up"},
                { value: 'down', label: "Down"},
                { value: 'left', label: "Left"},
                { value: 'right', label: "Right"},
            ]}
            value={value}
            onSelectValue={v => onChange?.(v)}
            stretch
        />
    );

    //return (
    //    <_SelectField
    //        param={param}
    //        value={value}
    //        options={[
    //            { value: 'up', label: "Up"},
    //            { value: 'down', label: "Down"},
    //            { value: 'left', label: "Left"},
    //            { value: 'right', label: "Right"},
    //        ]}
    //        onChange={onChange}
    //    />
    //);
}

export default DirectionParameter;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NumberInput, Select } from "@mantine/core";
import { Parameter } from "models/splatform";

export interface _SelectFieldProps<T> {
    param: Parameter<string>;
    value: T;
    options: {value: T, label: string}[];
    onChange?: (v: T) => void;
}

function _SelectField<T extends string> ({
    param,
    value,
    options,
    onChange,
}: _SelectFieldProps<T>) {
    return (
        <div className="parameter-container parameter-container-select">
            <Select
                size='sm'
                label={param.displayName}
                description={param.description}
                data={options}
                value={value}
                onChange={v => { if (v) onChange?.(v as T)}}
                allowDeselect={false}
                rightSection={<FontAwesomeIcon icon='chevron-down' />}
            />
        </div>
    );
}

export default _SelectField;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NumberInput, Select } from "@mantine/core";
import { Parameter } from "models/splatform";
import { getClassString } from "utils";

export interface _SelectFieldProps<T> {
    param: Parameter<string | null>;
    value: T | null;
    options: {value: T, label: string}[];
    disabled?: boolean;
    onChange?: (v: T) => void;
}

function _SelectField<T extends string> ({
    param,
    value,
    options,
    disabled = false,
    onChange,
}: _SelectFieldProps<T>) {
    const className = getClassString(
        "parameter-container",
        "parameter-container-select",
        disabled && "disabled",
    );

    return (
        <div className={className}>
            <Select
                size='sm'
                label={param.displayName}
                description={param.description}
                data={options}
                value={value}
                disabled={disabled}
                allowDeselect={false}
                onChange={v => { if (v) onChange?.(v as T)}}
                rightSection={<FontAwesomeIcon icon='chevron-down' />}
            />
        </div>
    );
}

export default _SelectField;
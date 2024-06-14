import { NumberInput } from "@mantine/core";
import { Parameter } from "models/splatform";
import { getClassString } from "utils";

export interface _NumberFieldProps {
    param: Parameter<number>;
    value: number;
    allowDecimals: boolean;
    disabled?: boolean;
    onChange?: (v: number) => void;
}

function _NumberField ({
    param,
    value,
    allowDecimals,
    disabled = false,
    onChange,
}: _NumberFieldProps) {
    const className = getClassString(
        "parameter-container",
        "parameter-container-number",
        disabled && "disabled",
    );

    return (
        <div className={className}>
            <NumberInput
                label={param.displayName}
                description={param.description}
                value={value}
                onChange={evt => onChange?.(Number(evt))}
                allowDecimal={allowDecimals}
                disabled={disabled}
            />
        </div>
    );
}

export default _NumberField;
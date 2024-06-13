import { NumberInput } from "@mantine/core";
import { Parameter } from "models/splatform";

export interface _NumberFieldProps {
    param: Parameter<number>;
    value: number;
    allowDecimals: boolean;
    onChange?: (v: number) => void;
}

function _NumberField ({
    param,
    value,
    allowDecimals,
    onChange,
}: _NumberFieldProps) {

    return (
        <div className="parameter-container parameter-container-number">
            <NumberInput
                label={param.displayName}
                description={param.description}
                value={value}
                onChange={evt => onChange?.(Number(evt))}
                allowDecimal={allowDecimals}
            />
        </div>
    );
}

export default _NumberField;
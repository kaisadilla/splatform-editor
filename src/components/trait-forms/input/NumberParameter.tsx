import { NumberInput } from "@mantine/core";
import { Parameter } from "models/splatform";

interface NumberParameterProps {
    param: Parameter<number>;
    value: number;
    allowDecimals: boolean;
    onChange?: (v: number) => void;
}

function NumberParameter ({
    param,
    value,
    allowDecimals,
    onChange,
}: NumberParameterProps) {

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

export default NumberParameter;
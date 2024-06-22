import TitledCheckbox from "elements/TitledCheckbox";
import { Parameter } from "models/splatform";
import { getClassString } from "utils";

export interface BooleanParameterProps {
    param: Parameter<boolean>;
    value: boolean;
    disabled?: boolean;
    onChange?: (v: boolean) => void;
}

function BooleanParameter ({
    param,
    value,
    disabled = false,
    onChange,
}: BooleanParameterProps) {
    const className = getClassString(
        "parameter-container",
        "parameter-container-boolean",
        disabled && "disabled",
    );

    return (
        <div className={className}>
            <TitledCheckbox
                label={param.displayName}
                description={param.description}
                checked={value}
                onChange={evt => onChange?.(evt.currentTarget.checked)}
                disabled={disabled}
            />
        </div>
    );
}

export default BooleanParameter;
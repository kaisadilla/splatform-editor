import TitledCheckbox from "elements/TitledCheckbox";
import { Parameter } from "models/splatform";

export interface BooleanParameterProps {
    param: Parameter<boolean>;
    value: boolean;
    onChange?: (v: boolean) => void;
}

function BooleanParameter ({
    param,
    value,
    onChange,
}: BooleanParameterProps) {

    return (
        <div className="parameter-container parameter-container-boolean">
            <TitledCheckbox
                label={param.displayName}
                description={param.description}
                checked={value}
                onChange={evt => onChange?.(evt.currentTarget.checked)}
            />
        </div>
    );
}

export default BooleanParameter;
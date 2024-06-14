import { BlockRegenerationMode, Parameter } from 'models/splatform';
import _SelectField from './base/SelectField';

export interface BlockRegenerationModeParameterProps {
    param: Parameter<BlockRegenerationMode | null>;
    value: BlockRegenerationMode | null;
    disabled?: boolean;
    onChange?: (v: BlockRegenerationMode) => void;
}

function BlockRegenerationModeParameter ({
    param,
    value,
    disabled,
    onChange,
}: BlockRegenerationModeParameterProps) {

    return (
        <_SelectField
            param={param}
            value={value}
            options={[
                { value: 'time', label: "Time"},
                { value: 'offscreen', label: "Offscreen"},
            ]}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default BlockRegenerationModeParameter;

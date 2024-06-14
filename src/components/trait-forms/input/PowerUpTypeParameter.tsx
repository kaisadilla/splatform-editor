import { Parameter, PowerUpType } from 'models/splatform';
import _SelectField from './base/SelectField';

export interface PowerUpTypeParameterProps {
    param: Parameter<PowerUpType>;
    value: PowerUpType;
    disabled?: boolean;
    onChange?: (v: PowerUpType) => void;
}

function PowerUpTypeParameter ({
    param,
    value,
    disabled,
    onChange,
}: PowerUpTypeParameterProps) {

    return (
        <_SelectField
            param={param}
            value={value}
            options={[
                { value: 'strong', label: "Strong"},
                { value: 'fireball', label: "Fireball"},
                { value: 'frog', label: "Frog"},
                { value: 'hammer', label: "Hammer"},
                { value: 'leaf', label: "Leaf"},
                { value: 'superball', label: "Superball"},
                { value: 'tanooki', label: "Tanooki"},
            ]}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default PowerUpTypeParameter;

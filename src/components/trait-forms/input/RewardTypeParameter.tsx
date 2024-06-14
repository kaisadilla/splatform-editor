import { Parameter, RewardType } from 'models/splatform';
import _SelectField from './base/SelectField';

export interface RewardTypeParameter {
    param: Parameter<RewardType | null>;
    value: RewardType | null;
    disabled?: boolean;
    onChange?: (v: RewardType) => void;
}

function RewardTypeParameter ({
    param,
    value,
    disabled,
    onChange,
}: RewardTypeParameter) {

    return (
        <_SelectField
            param={param}
            value={value}
            options={[
                { value: 'coin', label: "Coin" },
                { value: 'item', label: "Item" },
            ]}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default RewardTypeParameter;

import EntityTraits, { PowerUpEntityParameter, PowerUpEntityValueCollection } from 'data/EntityTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import PowerUpTypeParameter from '../input/PowerUpTypeParameter';

export type ChangePowerUpValueHandler
    = <K extends PowerUpEntityParameter>(
        parameter: K, value: PowerUpEntityValueCollection[K]
    ) => void;

export interface PowerUpTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: PowerUpEntityValueCollection;
    onChangeValue?: ChangePowerUpValueHandler
}

function PowerUpTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: PowerUpTraitFormProps) {
    const traitDef = EntityTraits.powerUp;

    const bPowerUpType = isEditable(configurableParameters, 'powerUpType');
    const bOverridesBetterPowers = isEditable(configurableParameters, 'overridesBetterPowers');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bPowerUpType && <PowerUpTypeParameter
                param={traitDef.parameters.powerUpType}
                value={values.powerUpType}
                onChange={v => onChangeValue?.('powerUpType', v)}
            />}
            {bOverridesBetterPowers && <BooleanParameter
                param={traitDef.parameters.overridesBetterPowers}
                value={values.overridesBetterPowers}
                onChange={v => onChangeValue?.('overridesBetterPowers', v)}
            />}
        </TraitForm>
    );
}

export default PowerUpTraitForm;

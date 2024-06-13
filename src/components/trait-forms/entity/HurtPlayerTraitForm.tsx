import EntityTraits, { HurtPlayerEntityParameter, HurtPlayerEntityValueCollection } from 'data/EntityTraits';
import React from 'react';
import TraitForm from '../TraitForm';
import PlayerDamageParameter from '../input/PlayerDamageParameter';
import BooleanParameter from '../input/BooleanParameter';

export type ChangeHurtPlayerValueHandler
    = <K extends HurtPlayerEntityParameter>(
        parameter: K, value: HurtPlayerEntityValueCollection[K]
    ) => void;

export interface HurtPlayerTraitFormProps {
    values: HurtPlayerEntityValueCollection;
    onChangeValue?: ChangeHurtPlayerValueHandler;
}

function HurtPlayerTraitForm ({
    values,
    onChangeValue,
    ...divProps
}: HurtPlayerTraitFormProps) {
    const traitDef = EntityTraits.hurtPlayer;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            <PlayerDamageParameter
                param={traitDef.parameters.damageType}
                value={values.damageType}
                onChange={v => onChangeValue?.('damageType', v)}
            />
            <BooleanParameter
                param={traitDef.parameters.hurtFromTop}
                value={values.hurtFromTop}
                onChange={v => onChangeValue?.('hurtFromTop', v)}
            />
            <BooleanParameter
                param={traitDef.parameters.hurtFromBottom}
                value={values.hurtFromBottom}
                onChange={v => onChangeValue?.('hurtFromBottom', v)}
            />
            <BooleanParameter
                param={traitDef.parameters.hurtFromLeft}
                value={values.hurtFromLeft}
                onChange={v => onChangeValue?.('hurtFromLeft', v)}
            />
            <BooleanParameter
                param={traitDef.parameters.hurtFromRight}
                value={values.hurtFromRight}
                onChange={v => onChangeValue?.('hurtFromRight', v)}
            />
        </TraitForm>
    );
}

export default HurtPlayerTraitForm;

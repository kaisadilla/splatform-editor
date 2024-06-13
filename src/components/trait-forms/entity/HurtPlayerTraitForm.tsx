import EntityTraits, { HurtPlayerEntityParameter, HurtPlayerEntityValueCollection } from 'data/EntityTraits';
import React from 'react';
import TraitForm, { isEditable } from '../TraitForm';
import PlayerDamageParameter from '../input/PlayerDamageParameter';
import BooleanParameter from '../input/BooleanParameter';

export type ChangeHurtPlayerValueHandler
    = <K extends HurtPlayerEntityParameter>(
        parameter: K, value: HurtPlayerEntityValueCollection[K]
    ) => void;

export interface HurtPlayerTraitFormProps {
    configurableParameters?: string[] | 'all';
    values: HurtPlayerEntityValueCollection;
    onChangeValue?: ChangeHurtPlayerValueHandler;
}

function HurtPlayerTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: HurtPlayerTraitFormProps) {
    const traitDef = EntityTraits.hurtPlayer;

    const bDamageType = isEditable(configurableParameters, 'damageType');
    const bHurtFromTop = isEditable(configurableParameters, 'hurtFromTop');
    const bHurtFromBottom = isEditable(configurableParameters, 'hurtFromBottom');
    const bHurtFromLeft = isEditable(configurableParameters, 'hurtFromLeft');
    const bHurtFromRight = isEditable(configurableParameters, 'hurtFromRight');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bDamageType && <PlayerDamageParameter
                param={traitDef.parameters.damageType}
                value={values.damageType}
                onChange={v => onChangeValue?.('damageType', v)}
            />}
            {bHurtFromTop && <BooleanParameter
                param={traitDef.parameters.hurtFromTop}
                value={values.hurtFromTop}
                onChange={v => onChangeValue?.('hurtFromTop', v)}
            />}
            {bHurtFromBottom && <BooleanParameter
                param={traitDef.parameters.hurtFromBottom}
                value={values.hurtFromBottom}
                onChange={v => onChangeValue?.('hurtFromBottom', v)}
            />}
            {bHurtFromLeft && <BooleanParameter
                param={traitDef.parameters.hurtFromLeft}
                value={values.hurtFromLeft}
                onChange={v => onChangeValue?.('hurtFromLeft', v)}
            />}
            {bHurtFromRight && <BooleanParameter
                param={traitDef.parameters.hurtFromRight}
                value={values.hurtFromRight}
                onChange={v => onChangeValue?.('hurtFromRight', v)}
            />}
        </TraitForm>
    );
}

export default HurtPlayerTraitForm;

import EntityTraits, { KillableEntityParameter, KillableEntityValueCollection } from 'data/EntityTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import EnemyDamageParameter from '../input/EnemyDamageParameter';

export type ChangeKillableValueHandler
    = <K extends KillableEntityParameter>(
        parameter: K, value: KillableEntityValueCollection[K]
    ) => void;

export interface KillableTraitFormProps extends DivProps {
    values: KillableEntityValueCollection;
    onChangeValue?: ChangeKillableValueHandler;
}

function KillableTraitForm ({
    values,
    onChangeValue,
    ...divProps
}: KillableTraitFormProps) {
    const traitDef = EntityTraits.killable;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            <EnemyDamageParameter
                param={traitDef.parameters.damageFromStomp}
                value={values.damageFromStomp}
                onChange={v => onChangeValue?.('damageFromStomp', v)}
            />
            <EnemyDamageParameter
                param={traitDef.parameters.damageFromFireball}
                value={values.damageFromFireball}
                onChange={v => onChangeValue?.('damageFromFireball', v)}
            />
        </TraitForm>
    );
}

export default KillableTraitForm;

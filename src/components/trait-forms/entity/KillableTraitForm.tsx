import EntityTraits, { KillableEntityParameter, KillableEntityValueCollection } from 'data/EntityTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import EnemyDamageParameter from '../input/EnemyDamageParameter';

export type ChangeKillableValueHandler
    = <K extends KillableEntityParameter>(
        parameter: K, value: KillableEntityValueCollection[K]
    ) => void;

export interface KillableTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: KillableEntityValueCollection;
    onChangeValue?: ChangeKillableValueHandler;
}

function KillableTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: KillableTraitFormProps) {
    const traitDef = EntityTraits.killable;

    const bDamageFromStomp = isEditable(configurableParameters, 'damageFromStomp');
    const bDamageFromFireball = isEditable(configurableParameters, 'damageFromFireball');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bDamageFromStomp && <EnemyDamageParameter
                param={traitDef.parameters.damageFromStomp}
                value={values.damageFromStomp}
                onChange={v => onChangeValue?.('damageFromStomp', v)}
            />}
            {bDamageFromFireball && <EnemyDamageParameter
                param={traitDef.parameters.damageFromFireball}
                value={values.damageFromFireball}
                onChange={v => onChangeValue?.('damageFromFireball', v)}
            />}
        </TraitForm>
    );
}

export default KillableTraitForm;

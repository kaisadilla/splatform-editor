import EntityTraits, { MoveAndFireEntityParameter, MoveAndFireEntityValueCollection } from 'data/EntityTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import IntegerParameter from '../input/IntegerParameter';
import PlayerDamageParameter from '../input/PlayerDamageParameter';
import FloatParameter from '../input/FloatParameter';
import DirectionParameter from '../input/DirectionParameter';

export type MoveAndFireEntityValueHandler
    = <K extends MoveAndFireEntityParameter>(
        parameter: K, value: MoveAndFireEntityValueCollection[K]
    ) => void;

export interface MoveAndFireTraitFormProps {
    configurableParameters?: string[] | 'all';
    values: MoveAndFireEntityValueCollection;
    onChangeValue?: MoveAndFireEntityValueHandler;
}

function MoveAndFireTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: MoveAndFireTraitFormProps) {
    const traitDef = EntityTraits.moveAndFire;

    const bBulletAmount = isEditable(configurableParameters, 'bulletAmount');
    const bBulletDamageType = isEditable(configurableParameters, 'bulletDamageType');
    const bMinDistance = isEditable(configurableParameters, 'minimumDistanceToActivate');
    const bMoveDir = isEditable(configurableParameters, 'moveDirection');
    const bDistanceToMove = isEditable(configurableParameters, 'distanceToMove');
    const bTimeToMove = isEditable(configurableParameters, 'timeToMove');
    const bTimeBetweenBullets = isEditable(configurableParameters, 'timeBetweenBullets');
    const bTimeBetweenMoves = isEditable(configurableParameters, 'timeBetweenMoves');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bBulletAmount && <IntegerParameter
                param={traitDef.parameters.bulletAmount}
                value={values.bulletAmount}
                onChange={v => onChangeValue?.('bulletAmount', v)}
            />}
            {bBulletDamageType && <PlayerDamageParameter
                param={traitDef.parameters.bulletDamageType}
                value={values.bulletDamageType}
                onChange={v => onChangeValue?.('bulletDamageType', v)}
            />}
            {bMinDistance && <FloatParameter
                param={traitDef.parameters.minimumDistanceToActivate}
                value={values.minimumDistanceToActivate}
                onChange={v => onChangeValue?.('minimumDistanceToActivate', v)}
            />}
            {bMoveDir && <DirectionParameter
                param={traitDef.parameters.moveDirection}
                value={values.moveDirection}
                onChange={v => onChangeValue?.('moveDirection', v)}
            />}
            {bDistanceToMove && <FloatParameter
                param={traitDef.parameters.distanceToMove}
                value={values.distanceToMove}
                onChange={v => onChangeValue?.('distanceToMove', v)}
            />}
            {bTimeToMove && <FloatParameter
                param={traitDef.parameters.timeToMove}
                value={values.timeToMove}
                onChange={v => onChangeValue?.('timeToMove', v)}
            />}
            {bTimeBetweenBullets && <FloatParameter
                param={traitDef.parameters.timeBetweenBullets}
                value={values.timeBetweenBullets}
                onChange={v => onChangeValue?.('timeBetweenBullets', v)}
            />}
            {bTimeBetweenMoves && <FloatParameter
                param={traitDef.parameters.timeBetweenMoves}
                value={values.timeBetweenMoves}
                onChange={v => onChangeValue?.('timeBetweenMoves', v)}
            />}
        </TraitForm>
    );
}

export default MoveAndFireTraitForm;

import EntityTraits, { TurnIntoShellEntityParameter, TurnIntoShellEntityValueCollection } from 'data/EntityTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import FloatParameter from '../input/FloatParameter';
import BooleanParameter from '../input/BooleanParameter';

export type ChangeTurnIntoShellValueHandler
    = <K extends TurnIntoShellEntityParameter>(
        parameter: K, value: TurnIntoShellEntityValueCollection[K]
    ) => void;

export interface TurnIntoShellTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: TurnIntoShellEntityValueCollection;
    onChangeValue?: ChangeTurnIntoShellValueHandler;
    onChangeMultipleValues?: (value: TurnIntoShellEntityValueCollection) => void;
}

function TurnIntoShellTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    onChangeMultipleValues,
    ...divProps
}: TurnIntoShellTraitFormProps) {
    const traitDef = EntityTraits.turnIntoShell;

    const bShellSpeed = isEditable(configurableParameters, 'shellSpeed');
    const bRevive = isEditable(configurableParameters, 'revive');
    const bSecondsUntilReviveStart = isEditable(
        configurableParameters, 'secondsUntilReviveStart'
    ) && values.revive === true;
    const bSecondsUntilReviveEnd = isEditable(
        configurableParameters, 'secondsUntilReviveEnd'
    ) && values.revive === true;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bShellSpeed && <FloatParameter
                param={traitDef.parameters.shellSpeed}
                value={values.shellSpeed}
                onChange={v => onChangeValue?.('shellSpeed', v)}
            />}
            {bRevive && <BooleanParameter
                param={traitDef.parameters.revive}
                value={values.revive}
                onChange={handleReviveChange}
            />}
            {bSecondsUntilReviveStart && <FloatParameter
                param={traitDef.parameters.secondsUntilReviveStart}
                value={values.secondsUntilReviveStart}
                onChange={v => onChangeValue?.('secondsUntilReviveStart', v)}
            />}
            {bSecondsUntilReviveEnd && <FloatParameter
                param={traitDef.parameters.secondsUntilReviveEnd}
                value={values.secondsUntilReviveEnd}
                onChange={v => onChangeValue?.('secondsUntilReviveEnd', v)}
            />}
        </TraitForm>
    );

    function handleReviveChange (val: boolean) {
        if (onChangeValue === undefined) return;
        if (onChangeMultipleValues === undefined) return;

        if (val) {
            onChangeValue('revive', val);
        }
        else {
            const start = traitDef.parameters.secondsUntilReviveStart.defaultValue;
            const end = traitDef.parameters.secondsUntilReviveEnd.defaultValue;

            onChangeMultipleValues({
                ...values,
                revive: val,
                secondsUntilReviveStart: start,
                secondsUntilReviveEnd: end,
            });
        }
    }
}

export default TurnIntoShellTraitForm;

import TileTraits, { FallTileParameter, FallTileValueCollection } from 'data/TileTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import ReferenceParameter from '../input/ReferenceParameter';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import FloatParameter from '../input/FloatParameter';
import BlockRegenerationModeParameter from '../input/BlockRegenerationModeParameter';
import PlayerDamageParameter from '../input/PlayerDamageParameter';

export type ChangeFallValueHandler
    = <K extends FallTileParameter>(
        parameter: K, value: FallTileValueCollection[K]
    ) => void;

export interface FallTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: FallTileValueCollection;
    onChangeValue?: ChangeFallValueHandler;
}

function FallTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: FallTraitFormProps) {
    const levelCtx = useLevelEditorContext();

    const traitDef = TileTraits.fall;

    const showTimeUntilFall = isEditable(configurableParameters, 'timeUntilFall');
    const showShakeBeforeFall = isEditable(configurableParameters, 'shakeBeforeFall');
    const showShakeAfter = isEditable(configurableParameters, 'shakeAfter');
    const showResetWhenPlLeaves = isEditable(configurableParameters, 'resetWhenPlayerLeaves');
    const showRegen = isEditable(configurableParameters, 'regenerate');
    const showRegenMode = isEditable(configurableParameters, 'regenerationMode');
    const showRegenTime = isEditable(configurableParameters, 'regenerationTime');
    const showFallSpeed = isEditable(configurableParameters, 'fallSpeed');
    const showColWhileFalling = isEditable(configurableParameters, 'hasCollisionWhileFalling');
    const showCanHitPlayers = isEditable(configurableParameters, 'canHitPlayers');
    const showDamageToPlayer = isEditable(configurableParameters, 'damageToPlayer');

    const enableShakeAfter = values.shakeBeforeFall;
    const enableRegenMode = values.regenerate === true
    const enableRegenTime = values.regenerate === true && values.regenerationMode === 'time';
    const enableCanHitPlayers = values.hasCollisionWhileFalling;
    const enableDamageToPlayer = values.hasCollisionWhileFalling && values.canHitPlayers;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {showTimeUntilFall && <FloatParameter
                param={traitDef.parameters.timeUntilFall}
                value={values.timeUntilFall}
                onChange={v => onChangeValue?.('timeUntilFall', v)}
            />}
            {showShakeBeforeFall && <BooleanParameter
                param={traitDef.parameters.shakeBeforeFall}
                value={values.shakeBeforeFall}
                onChange={v => onChangeValue?.('shakeBeforeFall', v)}
            />}
            {showShakeAfter && <FloatParameter
                param={traitDef.parameters.shakeAfter}
                value={values.shakeAfter}
                onChange={v => onChangeValue?.('shakeAfter', v)}
                disabled={enableShakeAfter === false}
            />}
            {showResetWhenPlLeaves && <BooleanParameter
                param={traitDef.parameters.resetWhenPlayerLeaves}
                value={values.resetWhenPlayerLeaves}
                onChange={v => onChangeValue?.('resetWhenPlayerLeaves', v)}
            />}
            {showRegen && <BooleanParameter
                param={traitDef.parameters.regenerate}
                value={values.regenerate}
                onChange={v => onChangeValue?.('regenerate', v)}
            />}
            {showRegenMode && <BlockRegenerationModeParameter
                param={traitDef.parameters.regenerationMode}
                value={values.regenerationMode}
                onChange={v => onChangeValue?.('regenerationMode', v)}
                disabled={enableRegenMode === false}
            />}
            {showRegenTime && <FloatParameter
                param={traitDef.parameters.regenerationTime}
                value={values.regenerationTime}
                onChange={v => onChangeValue?.('regenerationTime', v)}
                disabled={enableRegenTime === false}
            />}
            {showFallSpeed && <FloatParameter
                param={traitDef.parameters.fallSpeed}
                value={values.fallSpeed}
                onChange={v => onChangeValue?.('fallSpeed', v)}
            />}
            {showColWhileFalling && <BooleanParameter
                param={traitDef.parameters.hasCollisionWhileFalling}
                value={values.hasCollisionWhileFalling}
                onChange={v => onChangeValue?.('hasCollisionWhileFalling', v)}
            />}
            {showCanHitPlayers && <BooleanParameter
                param={traitDef.parameters.canHitPlayers}
                value={values.canHitPlayers}
                onChange={v => onChangeValue?.('canHitPlayers', v)}
                disabled={enableCanHitPlayers === false}
            />}
            {showDamageToPlayer && <PlayerDamageParameter
                param={traitDef.parameters.damageToPlayer}
                value={values.damageToPlayer}
                onChange={v => onChangeValue?.('damageToPlayer', v)}
                disabled={enableDamageToPlayer === false}
            />}
        </TraitForm>
    );
}

export default FallTraitForm;
import TileTraits, { RewardBlockTileParameter, RewardBlockTileValueCollection } from 'data/TileTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import ReferenceParameter from '../input/ReferenceParameter';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import RewardTypeParameter from '../input/RewardTypeParameter';
import { RewardType } from 'models/splatform';
import IntegerParameter from '../input/IntegerParameter';
import FloatParameter from '../input/FloatParameter';

export type ChangeRewardBlockValueHandler
    = <K extends RewardBlockTileParameter>(
        parameter: K, value: RewardBlockTileValueCollection[K]
    ) => void;

export interface RewardBlockTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: RewardBlockTileValueCollection;
    onChangeValue?: ChangeRewardBlockValueHandler;
    onChangeMultipleValues?: (value: RewardBlockTileValueCollection) => void;
}

function RewardBlockTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    onChangeMultipleValues,
    ...divProps
}: RewardBlockTraitFormProps) {
    const levelCtx = useLevelEditorContext();

    const traitDef = TileTraits.rewardBlock;

    const enableReward = values.rewardType === 'item';
    const enableSmallPlayerReward = values.smallPlayerHasDifferentReward === true;
    const enableBonusMaxHits = values.hasBonusForReachingMaxHits === true;
    const enableReplacementWhenEmptied = values.isReplacedWhenEmptied === true;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {editable('rewardType') && <RewardTypeParameter
                param={traitDef.parameters.rewardType}
                value={values.rewardType}
                onChange={handleChangeRewardType}
            />}
            {levelCtx.resourcePack && editable('reward') && <ReferenceParameter
                pack={levelCtx.resourcePack}
                param={traitDef.parameters.reward}
                value={values.reward}
                allowTiles
                allowEntities
                disabled={enableReward === false}
                onChange={v => onChangeValue?.('reward', v)}
            />}
            {editable('smallPlayerHasDifferentReward') && <BooleanParameter
                param={traitDef.parameters.smallPlayerHasDifferentReward}
                value={values.smallPlayerHasDifferentReward}
                onChange={v => onChangeValue?.('smallPlayerHasDifferentReward', v)}
            />}
            {levelCtx.resourcePack && editable('smallPlayerReward') && <ReferenceParameter
                pack={levelCtx.resourcePack}
                param={traitDef.parameters.smallPlayerReward}
                value={values.smallPlayerReward}
                allowTiles
                allowEntities
                disabled={enableSmallPlayerReward === false}
                onChange={v => onChangeValue?.('smallPlayerReward', v)}
            />}
            {editable('maxHits') && <IntegerParameter
                param={traitDef.parameters.maxHits}
                value={values.maxHits}
                onChange={v => onChangeValue?.('maxHits', v)}
            />}
            {editable('maxHits') && <FloatParameter
                param={traitDef.parameters.maxTime}
                value={values.maxTime}
                onChange={v => onChangeValue?.('maxTime', v)}
            />}
            {editable('waitForFinalHitBeforeBecomingEmpty') && <BooleanParameter
                param={traitDef.parameters.waitForFinalHitBeforeBecomingEmpty}
                value={values.waitForFinalHitBeforeBecomingEmpty}
                onChange={v => onChangeValue?.('waitForFinalHitBeforeBecomingEmpty', v)}
            />}
            {editable('hasBonusForReachingMaxHits') && <BooleanParameter
                param={traitDef.parameters.hasBonusForReachingMaxHits}
                value={values.hasBonusForReachingMaxHits}
                onChange={v => onChangeValue?.('hasBonusForReachingMaxHits', v)}
            />}
            {levelCtx.resourcePack && editable('bonusForReachingMaxHits') && <ReferenceParameter
                pack={levelCtx.resourcePack}
                param={traitDef.parameters.bonusForReachingMaxHits}
                value={values.bonusForReachingMaxHits}
                allowTiles
                allowEntities
                disabled={enableBonusMaxHits === false}
                onChange={v => onChangeValue?.('bonusForReachingMaxHits', v)}
            />}
            {editable('isReplacedWhenEmptied') && <BooleanParameter
                param={traitDef.parameters.isReplacedWhenEmptied}
                value={values.isReplacedWhenEmptied}
                onChange={v => onChangeValue?.('isReplacedWhenEmptied', v)}
            />}
            {levelCtx.resourcePack && editable('replacementWhenEmptied') && <ReferenceParameter
                pack={levelCtx.resourcePack}
                param={traitDef.parameters.replacementWhenEmptied}
                value={values.replacementWhenEmptied}
                allowTiles
                allowEntities
                disabled={enableReplacementWhenEmptied === false}
                onChange={v => onChangeValue?.('replacementWhenEmptied', v)}
            />}
            {editable('revertToCoinAfterFirstHit') && <BooleanParameter
                param={traitDef.parameters.revertToCoinAfterFirstHit}
                value={values.revertToCoinAfterFirstHit}
                onChange={v => onChangeValue?.('revertToCoinAfterFirstHit', v)}
            />}
            {editable('triggerWhenPunched') && <BooleanParameter
                param={traitDef.parameters.triggerWhenPunched}
                value={values.triggerWhenPunched}
                onChange={v => onChangeValue?.('triggerWhenPunched', v)}
            />}
            {editable('triggerWhenSpin') && <BooleanParameter
                param={traitDef.parameters.triggerWhenSpin}
                value={values.triggerWhenSpin}
                onChange={v => onChangeValue?.('triggerWhenSpin', v)}
            />}
            {editable('triggerWhenHitByShell') && <BooleanParameter
                param={traitDef.parameters.triggerWhenHitByShell}
                value={values.triggerWhenHitByShell}
                onChange={v => onChangeValue?.('triggerWhenHitByShell', v)}
            />}
            {editable('triggerWhenHitByRaccoonTail') && <BooleanParameter
                param={traitDef.parameters.triggerWhenHitByRaccoonTail}
                value={values.triggerWhenHitByRaccoonTail}
                onChange={v => onChangeValue?.('triggerWhenHitByRaccoonTail', v)}
            />}
            {editable('triggerWhenHitByPlayerFireball') && <BooleanParameter
                param={traitDef.parameters.triggerWhenHitByPlayerFireball}
                value={values.triggerWhenHitByPlayerFireball}
                onChange={v => onChangeValue?.('triggerWhenHitByPlayerFireball', v)}
            />}
            {editable('triggerWhenHitByEnemyFireball') && <BooleanParameter
                param={traitDef.parameters.triggerWhenHitByEnemyFireball}
                value={values.triggerWhenHitByEnemyFireball}
                onChange={v => onChangeValue?.('triggerWhenHitByEnemyFireball', v)}
            />}
        </TraitForm>
    );

    // returns true if the parameter is editable
    function editable (key: RewardBlockTileParameter) {
        return isEditable(configurableParameters, key);
    }

    function handleChangeRewardType (val: RewardType) {
        if (onChangeValue === undefined) return;
        if (onChangeMultipleValues === undefined) return;

        if (val === 'item') {
            onChangeValue('rewardType', val);
        }
        else {
            onChangeMultipleValues({
                ...values,
                rewardType: val,
                reward: null,
            });
        }
    }
}

export default RewardBlockTraitForm;
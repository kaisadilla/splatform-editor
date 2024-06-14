import TileTraits, { BreakableTileParameter, BreakableTileValueCollection } from 'data/TileTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import ReferenceParameter from '../input/ReferenceParameter';
import { useLevelEditorContext } from 'context/useLevelEditorContext';

export type ChangeBreakableValueHandler
    = <K extends BreakableTileParameter>(
        parameter: K, value: BreakableTileValueCollection[K]
    ) => void;

export interface BreakableTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: BreakableTileValueCollection;
    onChangeValue?: ChangeBreakableValueHandler;
    onChangeMultipleValues?: (value: BreakableTileValueCollection) => void;
}

function BreakableTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    onChangeMultipleValues,
    ...divProps
}: BreakableTraitFormProps) {
    const levelCtx = useLevelEditorContext();

    const traitDef = TileTraits.breakable;

    const bBreakWhenPunched = isEditable(configurableParameters, 'breakWhenPunched');
    const bBreakWhenSpin = isEditable(configurableParameters, 'breakWhenSpin');
    const bBreakWhenHitByShell = isEditable(configurableParameters, 'breakWhenHitByShell');
    const bBreakWhenHitByRaccoonTail = isEditable(configurableParameters, 'breakWhenHitByRaccoonTail');
    const bBreakWhenHitByPlayerFireball = isEditable(configurableParameters, 'breakWhenHitByPlayerFireball');
    const bBreakWhenHitByEnemyFireball = isEditable(configurableParameters, 'breakWhenHitByEnemyFireball');
    const bIsReplacedWhenBroken = isEditable(configurableParameters, 'isReplacedWhenBroken');
    const bReplacementWhenBroken = values.isReplacedWhenBroken === true
        && isEditable(configurableParameters, 'replacementWhenBroken');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bBreakWhenPunched && <BooleanParameter
                param={traitDef.parameters.breakWhenPunched}
                value={values.breakWhenPunched}
                onChange={v => onChangeValue?.('breakWhenPunched', v)}
            />}
            {bBreakWhenSpin && <BooleanParameter
                param={traitDef.parameters.breakWhenSpin}
                value={values.breakWhenSpin}
                onChange={v => onChangeValue?.('breakWhenSpin', v)}
            />}
            {bBreakWhenHitByShell && <BooleanParameter
                param={traitDef.parameters.breakWhenHitByShell}
                value={values.breakWhenHitByShell}
                onChange={v => onChangeValue?.('breakWhenHitByShell', v)}
            />}
            {bBreakWhenHitByRaccoonTail && <BooleanParameter
                param={traitDef.parameters.breakWhenHitByRaccoonTail}
                value={values.breakWhenHitByRaccoonTail}
                onChange={v => onChangeValue?.('breakWhenHitByRaccoonTail', v)}
            />}
            {bBreakWhenHitByPlayerFireball && <BooleanParameter
                param={traitDef.parameters.breakWhenHitByPlayerFireball}
                value={values.breakWhenHitByPlayerFireball}
                onChange={v => onChangeValue?.('breakWhenHitByPlayerFireball', v)}
            />}
            {bBreakWhenHitByEnemyFireball && <BooleanParameter
                param={traitDef.parameters.breakWhenHitByEnemyFireball}
                value={values.breakWhenHitByEnemyFireball}
                onChange={v => onChangeValue?.('breakWhenHitByEnemyFireball', v)}
            />}
            {bIsReplacedWhenBroken && <BooleanParameter
                param={traitDef.parameters.isReplacedWhenBroken}
                value={values.isReplacedWhenBroken}
                onChange={handleIsReplacedWhenBrokenChange}
            />}
            {levelCtx.resourcePack && bReplacementWhenBroken && <ReferenceParameter
                pack={levelCtx.resourcePack}
                param={traitDef.parameters.replacementWhenBroken}
                allowTiles
                allowTileEntities
                allowEntities
                value={values.replacementWhenBroken}
                onChange={v => onChangeValue?.('replacementWhenBroken', v)}
            />}
        </TraitForm>
    );

    function handleIsReplacedWhenBrokenChange (val: boolean) {
        if (onChangeValue === undefined) return;
        if (onChangeMultipleValues === undefined) return;

        
        if (val) {
            onChangeValue('isReplacedWhenBroken', val);
        }
        else {
            onChangeMultipleValues({
                ...values,
                isReplacedWhenBroken: val,
                replacementWhenBroken: null,
            });
        }
    }
}

export default BreakableTraitForm;
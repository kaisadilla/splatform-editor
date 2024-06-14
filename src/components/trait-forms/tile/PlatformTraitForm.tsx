import TileTraits, { PlatformTileParameter, PlatformTileValueCollection } from 'data/TileTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import ReferenceParameter from '../input/ReferenceParameter';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import FloatParameter from '../input/FloatParameter';
import BlockRegenerationModeParameter from '../input/BlockRegenerationModeParameter';
import PlayerDamageParameter from '../input/PlayerDamageParameter';

export type ChangePlatformValueHandler
    = <K extends PlatformTileParameter>(
        parameter: K, value: PlatformTileValueCollection[K]
    ) => void;

export interface PlatformTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: PlatformTileValueCollection;
    onChangeValue?: ChangePlatformValueHandler;
    onChangeMultipleValues?: (value: PlatformTileValueCollection) => void;
}

function PlatformTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    onChangeMultipleValues,
    ...divProps
}: PlatformTraitFormProps) {
    const traitDef = TileTraits.platform;

    const showCollideFromTop = isEditable(configurableParameters, 'collideFromTop');
    const showCollideFromBottom = isEditable(configurableParameters, 'collideFromBottom');
    const showCollideFromLeft = isEditable(configurableParameters, 'collideFromLeft');
    const showCollideFromRight = isEditable(configurableParameters, 'collideFromRight');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {showCollideFromTop && <BooleanParameter
                param={traitDef.parameters.collideFromTop}
                value={values.collideFromTop}
                onChange={v => onChangeValue?.('collideFromTop', v)}
            />}
            {showCollideFromBottom && <BooleanParameter
                param={traitDef.parameters.collideFromBottom}
                value={values.collideFromBottom}
                onChange={v => onChangeValue?.('collideFromBottom', v)}
            />}
            {showCollideFromLeft && <BooleanParameter
                param={traitDef.parameters.collideFromLeft}
                value={values.collideFromLeft}
                onChange={v => onChangeValue?.('collideFromLeft', v)}
            />}
            {showCollideFromRight && <BooleanParameter
                param={traitDef.parameters.collideFromRight}
                value={values.collideFromRight}
                onChange={v => onChangeValue?.('collideFromRight', v)}
            />}
        </TraitForm>
    );
}

export default PlatformTraitForm;
import TileTraits, { BlockTileParameter, BlockTileValueCollection } from 'data/TileTraits';
import React from 'react';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';

export type ChangeBlockValueHandler
    = <K extends BlockTileParameter>(
        parameter: K, value: BlockTileValueCollection[K]
    ) => void;

export interface BlockTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: BlockTileValueCollection;
    onChangeValue?: ChangeBlockValueHandler;
}

function BlockTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: BlockTraitFormProps) {
    const traitDef = TileTraits.block;

    const bIsHidden = isEditable(configurableParameters, 'isHidden');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bIsHidden && <BooleanParameter
                param={traitDef.parameters.isHidden}
                value={values.isHidden}
                onChange={v => onChangeValue?.('isHidden', v)}
            />}
        </TraitForm>
    );
}

export default BlockTraitForm;
import TileTraits, { BackgroundTileParameter, BackgroundTileValueCollection } from 'data/TileTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';

export type ChangeBackgroundValueHandler
    = <K extends BackgroundTileParameter>(
        parameter: K, value: BackgroundTileValueCollection[K]
    ) => void;

export interface BackgroundTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: BackgroundTileValueCollection;
    onChangeValue?: ChangeBackgroundValueHandler;
}

function BackgroundTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: BackgroundTraitFormProps) {
    const traitDef = TileTraits.background;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >

        </TraitForm>
    );
}

export default BackgroundTraitForm;
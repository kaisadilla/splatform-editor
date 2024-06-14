import TileTraits, { TerrainTileParameter, TerrainTileValueCollection } from 'data/TileTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';

export type ChangeTerrainValueHandler
    = <K extends TerrainTileParameter>(
        parameter: K, value: TerrainTileValueCollection[K]
    ) => void;

export interface TerrainTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: TerrainTileValueCollection;
    onChangeValue?: ChangeTerrainValueHandler;
}

function TerrainTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: TerrainTraitFormProps) {
    const traitDef = TileTraits.terrain;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >

        </TraitForm>
    );
}

export default TerrainTraitForm;
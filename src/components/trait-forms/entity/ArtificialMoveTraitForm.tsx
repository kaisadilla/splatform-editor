import EntityTraits, { ArtificialMoveEntityValueCollection, ArtificialMoveEntityParameter } from 'data/EntityTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import FloatParameter from '../input/FloatParameter';

export type ChangeArtificialMoveValueHandler
    = <K extends ArtificialMoveEntityParameter>(
        parameter: K, value: ArtificialMoveEntityValueCollection[K]
    ) => void;

export interface ArtificialMoveTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: ArtificialMoveEntityValueCollection;
    onChangeValue?: ChangeArtificialMoveValueHandler;
}

function ArtificialMoveTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: ArtificialMoveTraitFormProps) {
    const traitDef = EntityTraits.artificialMove;

    const bAvoidCliffs = isEditable(configurableParameters, 'avoidCliffs');
    const bHorizSpeed = isEditable(configurableParameters, 'horizontalSpeed');
    const bVertSpeed = isEditable(configurableParameters, 'verticalSpeed');

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            {bAvoidCliffs && <BooleanParameter
                param={traitDef.parameters.avoidCliffs}
                value={values.avoidCliffs}
                onChange={v => onChangeValue?.('avoidCliffs', v)}
            />}
            {bHorizSpeed && <FloatParameter
                param={traitDef.parameters.horizontalSpeed}
                value={values.horizontalSpeed}
                onChange={v => onChangeValue?.('horizontalSpeed', v)}
            />}
            {bVertSpeed && <FloatParameter
                param={traitDef.parameters.verticalSpeed}
                value={values.verticalSpeed}
                onChange={v => onChangeValue?.('verticalSpeed', v)}
            />}
        </TraitForm>
    );
}

export default ArtificialMoveTraitForm;

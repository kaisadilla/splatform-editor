import EntityTraits, { ArtificialMoveEntityValueCollection, ArtificialMoveEntityParameter } from 'data/EntityTraits';
import { DivProps } from 'types';
import TraitForm from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import FloatParameter from '../input/FloatParameter';

export type ChangeArtificialMoveValueHandler
    = <K extends ArtificialMoveEntityParameter>(
        parameter: K, value: ArtificialMoveEntityValueCollection[K]
    ) => void;

export interface ArtificialMoveTraitFormProps extends DivProps {
    values: ArtificialMoveEntityValueCollection;
    onChangeValue?: ChangeArtificialMoveValueHandler;
}

function ArtificialMoveTraitForm ({
    values,
    onChangeValue,
    ...divProps
}: ArtificialMoveTraitFormProps) {
    const traitDef = EntityTraits.artificialMove;

    return (
        <TraitForm
            title={traitDef.displayName}
            {...divProps}
        >
            <BooleanParameter
                param={traitDef.parameters.avoidCliffs}
                value={values.avoidCliffs}
                onChange={v => onChangeValue?.('avoidCliffs', v)}
            />
            <FloatParameter
                param={traitDef.parameters.horizontalSpeed}
                value={values.horizontalSpeed}
                onChange={v => onChangeValue?.('horizontalSpeed', v)}
            />
            <FloatParameter
                param={traitDef.parameters.verticalSpeed}
                value={values.verticalSpeed}
                onChange={v => onChangeValue?.('verticalSpeed', v)}
            />
        </TraitForm>
    );
}

export default ArtificialMoveTraitForm;

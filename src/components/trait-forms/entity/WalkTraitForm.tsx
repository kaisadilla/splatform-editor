import EntityTraits, { WalkEntityParameter, WalkEntityValueCollection } from 'data/EntityTraits';
import { DivProps } from 'types';
import TraitForm, { isEditable } from '../TraitForm';
import BooleanParameter from '../input/BooleanParameter';
import FloatParameter from '../input/FloatParameter';

export type ChangeWalkValueHandler
    = <K extends WalkEntityParameter>(
        parameter: K, value: WalkEntityValueCollection[K]
    ) => void;

export interface WalkTraitFormProps extends DivProps {
    configurableParameters?: string[] | 'all';
    values: WalkEntityValueCollection;
    onChangeValue?: ChangeWalkValueHandler
}

function WalkTraitForm ({
    configurableParameters,
    values,
    onChangeValue,
    ...divProps
}: WalkTraitFormProps) {
    const traitDef = EntityTraits.walk;

    const bAvoidCliffs = isEditable(configurableParameters, 'avoidCliffs');
    const bWalkingSpeed = isEditable(configurableParameters, 'walkingSpeed');

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
            {bWalkingSpeed && <FloatParameter
                param={traitDef.parameters.walkingSpeed}
                value={values.walkingSpeed}
                onChange={v => onChangeValue?.('walkingSpeed', v)}
            />}
        </TraitForm>
    );
}

export default WalkTraitForm;

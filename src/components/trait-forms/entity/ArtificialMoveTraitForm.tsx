import EntityTraits, { ArtificialMoveParameter, ArtificialMoveValueCollection } from 'data/EntityTraits';
import { ParameterValueCollection } from 'models/splatform';
import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';
import BooleanParameter from '../input/BooleanParameter';
import NumberParameter from '../input/NumberParameter';

export type ChangeArtificialMoveValueHandler
    = <K extends ArtificialMoveParameter>(
        parameter: K, value: ArtificialMoveValueCollection[K]
    ) => void;

export interface ArtificialMoveTraitFormProps extends DivProps {
    values: ArtificialMoveValueCollection;
    onChangeValue?: ChangeArtificialMoveValueHandler;
}

function ArtificialMoveTraitForm ({
    values,
    onChangeValue,
    ...divProps
}: ArtificialMoveTraitFormProps) {
    const traitDef = EntityTraits.artificialMove;

    divProps.className = getClassString(
        "trait-form",
        divProps.className,
    )

    return (
        <div className="trait-form">
            <div className="header">{traitDef.displayName}</div>
            <div className="parameter-list">
                <BooleanParameter
                    param={traitDef.parameters.avoidCliffs}
                    value={values.avoidCliffs}
                    onChange={v => onChangeValue?.('avoidCliffs', v)}
                />
                <NumberParameter
                    param={traitDef.parameters.horizontalSpeed}
                    value={values.horizontalSpeed}
                    allowDecimals
                    onChange={v => onChangeValue?.('horizontalSpeed', v)}
                />
            </div>
        </div>
    );
}

export default ArtificialMoveTraitForm;

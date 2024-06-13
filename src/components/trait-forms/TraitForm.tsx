import React from 'react';
import { DivProps } from 'types';
import { getClassString } from 'utils';

export interface TraitFormProps extends DivProps {
    title: string;
    children: React.ReactNode;
}

function TraitForm ({
    title,
    children,
    ...divProps
}: TraitFormProps) {
    divProps.className = getClassString(
        "trait-form",
        divProps.className,
    );

    return (
        <div {...divProps}>
            <div className="header">{title}</div>
            <div className="parameter-list">
                {children}
            </div>
        </div>
    );
}

/**
 * Given a parameter and a list of editable parameters, returns whether the
 * parameter given is editable. The list can be undefined, in which place no
 * parameter is editable. The list can also be the string 'all', in which case
 * all parameters are editable.
 * @param configurableParameters The list of editable parameters.
 * @param paramName The name of the parameter.
 * @returns True if the parameter is editable.
 */
export function isEditable (
    configurableParameters: string[] | undefined | null | 'all', paramName: string
) {
    return configurableParameters === 'all'
        || configurableParameters?.includes(paramName) === true;
}

export default TraitForm;

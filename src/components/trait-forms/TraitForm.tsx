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

export default TraitForm;

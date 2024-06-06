import { TextInput, TextInputProps } from '@mantine/core';
import React, { useState } from 'react';
import { getClassString } from 'utils';

export interface ActivatableTextInputProps extends TextInputProps {
    
}

function ActivatableTextInput ({
    readOnly,
    variant,
    classNames,
    ...textInputProps
}: ActivatableTextInputProps) {
    const [editable, setEditable] = useState(false);

    const rootClasses = getClassString(
        // @ts-ignore false error
        classNames?.root,
        "sp-activatable-text-input",
        editable === false && "readonly"
    )

    if (classNames) {
        // @ts-ignore false error
        classNames.root = rootClasses;
    }
    else {
        classNames = {
            root: rootClasses
        }
    }

    return (
        <TextInput {...textInputProps}
            classNames={classNames}
            readOnly={editable === false}
            variant={editable ? 'filled' : 'filled'}
            onDoubleClick={handleDblClick}
            onBlur={handleBlur}
        />
    );

    function handleDblClick () {
        setEditable(true);
    }

    function handleBlur () {
        setEditable(false);
        window.getSelection()?.removeAllRanges();
    }
}

export default ActivatableTextInput;

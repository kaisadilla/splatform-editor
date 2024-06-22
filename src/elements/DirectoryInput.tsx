import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, InputWrapper, InputWrapperProps, Text, TextInput } from '@mantine/core';
import Ipc from 'main/ipc/ipcRenderer';
import React from 'react';
import { getClassString } from 'utils';

export interface DirectoryInputProps extends InputWrapperProps {
    value: string | null;
    onSelectPath?: (v: string | null) => void;
}

function DirectoryInput ({
    value,
    onSelectPath,
    classNames,
    ...inputWrapperProps
}: DirectoryInputProps) {
    if (classNames === undefined) {
        classNames = {};
    }

    classNames = {
        ...classNames,
        // @ts-ignore
        root: getClassString("sp-directory-input-root", classNames.root),
    }

    return (
        <InputWrapper classNames={classNames} {...inputWrapperProps}>
            <div className="sp-directory-input-content">
                <TextInput
                    classNames={{root: "sp-directory-input-text"}}
                    value={value ?? ""}
                    readOnly
                />
                <Button
                    classNames={{
                        root: "sp-directory-input-button",
                        label: "sp-directory-input-label"
                    }}
                    onClick={handleClick}
                >
                    <FontAwesomeIcon icon='folder-open' />
                    <Text>Change</Text>
                </Button>
            </div>
        </InputWrapper>
    );

    async function handleClick () {
        const path = await Ipc.openDirectory("Select parent directory");

        if (path) {
            onSelectPath?.(path.fullPath);
        }
    }
}

export default DirectoryInput;

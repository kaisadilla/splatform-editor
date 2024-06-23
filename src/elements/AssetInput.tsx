import { Button, InputProps, InputWrapper, InputWrapperProps, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from 'context/useAppContext';
import { FileMetadata, ResourcePack } from 'models/ResourcePack';
import React, { useId, useRef, useState } from 'react';
import { getClassString, isString } from 'utils';

export interface AssetInputProps extends InputWrapperProps {
    value: string;
    disabled: boolean;
    onSelectValue?: (val: string) => void;
    modalTitle: string;
    opened: boolean;
    open: () => void;
    close: () => void;
    children: React.ReactNode;
}

function AssetInput ({
    value,
    disabled,
    onSelectValue,
    modalTitle,
    opened,
    open,
    close,
    children,
    ...inputWrapperProps
}: AssetInputProps) {
    return (
        <InputWrapper
            {...inputWrapperProps}
        >
            <Button
                variant='default'
                classNames={{
                    root: "sp-asset-input-button",
                    inner: "sp-asset-input-inner",
                    label: "sp-asset-input-label",
                }}
                onClick={open}
                disabled={disabled}
            >
                {value}
            </Button>

            <Modal
                size="75%"
                title={modalTitle}
                centered
                opened={disabled === false && opened}
                onClose={close}
                classNames={{
                    root: "sp-modal-root sp-asset-input-modal-root",
                    content: "sp-modal-content sp-asset-input-content",
                    header: "sp-modal-header sp-asset-input-header",
                    title: "sp-modal-title sp-asset-input-title",
                    close: "sp-modal-close sp-asset-input-close",
                    body: "sp-modal-body sp-asset-input-body",
                }}
            >
                {children}
            </Modal>
        </InputWrapper>
    );

    function handleSelectValue (val: string) {
        onSelectValue?.(val);
        close();
    }
}

export default AssetInput;

import Button, { ButtonProps } from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import { forwardRef, useState } from 'react';

import { MenuItemData } from '../definitions';
import { ChevronDown } from '../icons/ChevronDown';
import { nestedMenuItemsFromObject } from './nestedMenuItemsFromObject';

interface NestedDropdownProps {
    children?: React.ReactNode;
    menuItemsData?: MenuItemData;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    ButtonProps?: Partial<ButtonProps>;
    MenuProps?: Partial<MenuProps>;
    showChevron?: boolean;
}

export const NestedDropdown = forwardRef<HTMLDivElement | null, NestedDropdownProps>(function NestedDropdown(
    {
        menuItemsData: data,
        onClick,
        ButtonProps,
        MenuProps,
        showChevron = false,
        ...rest
    },
    ref
) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        onClick && onClick(e);
    };
    const handleClose = () => setAnchorEl(null);

    const menuItems = nestedMenuItemsFromObject({
        handleClose,
        isOpen: open,
        menuItemsData: data?.items ?? [],
    });

    let extendedButtonProps: Partial<ButtonProps> | undefined;
    if (open) {
        extendedButtonProps = {
            ...ButtonProps,
            classes: {
                ...ButtonProps?.classes,
                root: (ButtonProps?.classes?.root ?? "") + " " + (ButtonProps?.classes?.root ?? "") + "-open"
            }
        }
    }
    else {
        extendedButtonProps = ButtonProps;
    }

    return (
        <div ref={ref} {...rest}>
            <Button onClick={handleClick} endIcon={showChevron && <ChevronDown />} {...extendedButtonProps}>
                {data?.label ?? 'Menu'}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} {...MenuProps}>
                {menuItems}
            </Menu>
        </div>
    );
});

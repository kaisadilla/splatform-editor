import Button, { ButtonProps } from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import { forwardRef, useRef, useState } from 'react';

import { MenuItemData } from '../definitions';
import { ChevronDown } from '../icons/ChevronDown';
import { nestedMenuItemsFromObject } from './nestedMenuItemsFromObject';

// TODO: WIP

interface PermanentMenuProps {
    children?: React.ReactNode;
    menuItemsData?: MenuItemData;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    ButtonProps?: Partial<ButtonProps>;
    MenuProps?: Partial<MenuProps>;
    showChevron?: boolean;
}

export const PermanentMenu = forwardRef<HTMLDivElement | null, PermanentMenuProps>(function PermanentMenu(
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
    const ref2 = useRef<HTMLDivElement>(null);
    
    const open = Boolean(anchorEl);

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
            <div ref={ref2} style={{width: "200px", height: "200px", background: "red"}}>
                <Menu
                    anchorEl={ref2.current}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    open={true}
                    {...MenuProps}
                >
                    {menuItems}
                </Menu>
            </div>
        </div>
    );
});

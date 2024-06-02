import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx';

export interface MenuItemData {
    uid?: string;
    label?: JSX.Element | string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    callback?: (event: React.MouseEvent<HTMLElement>, item: MenuItemData) => void;
    items?: MenuItemData[];
    disabled?: boolean;
    sx?: SxProps;
    delay?: number;
}

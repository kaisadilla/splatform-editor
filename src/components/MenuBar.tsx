import { Menu } from '@mantine/core';
import { MenuItemData, NestedDropdown } from '.lib/mui-nested-menu';
import React, { useEffect } from 'react';

export interface MenuBarProps {
    
}

function MenuBar (props: MenuBarProps) {
    const fileData: MenuItemData = {
        label: <div className="menu-bar-button">File</div>,
        items: [
            {
                label: "New",
                delay: 0,
                items: [
                    {
                        label: "Level",
                        callback: () => console.log("New level!"),
                    },
                    {
                        label: "World",
                    },
                    {
                        label: "Game",
                    },
                ]
            },
            {
                label: "Open",
                callback: () => console.log("Open level!"),
            },
            {
                label: "Save",
            },
            {
                label: "Save copy",
                
            }
        ]
    }

    return (
        <div className="menu-bar">
            <NestedDropdown
                menuItemsData={fileData}
                MenuProps={{
                    elevation: 0,
                    classes: {
                        root: "titlebar-menu-bar-root",
                        paper: "menu-bar-paper",
                        list: "menu-bar-list",
                    },
                }}
                ButtonProps={{
                    classes: {
                        root: "menu-bar-section",
                        icon: "iconn",
                    },
                }}
            />
        </div>
    );
}

/**
            <Menu width={200}>
                <Menu.Target>
                    <div className="menu-bar-section">File</div>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item>
                        New file
                    </Menu.Item>
                    <Menu.Item>
                        Open file
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu> */

export default MenuBar;

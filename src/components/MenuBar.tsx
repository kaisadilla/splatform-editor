import { Menu } from '@mantine/core';
import { MenuItemData, NestedDropdown } from '.lib/mui-nested-menu';
import React, { useEffect } from 'react';
import { FileIcons } from 'icons';
import Ipc from 'main/ipc/ipcRenderer';
import { useAppContext } from 'context/useAppContext';

export interface MenuBarProps {
    
}

function MenuBar (props: MenuBarProps) {
    const { resourcePacks } = useAppContext();

    useEffect(() => {
        console.log(resourcePacks);
    }, [resourcePacks]);

    const fileData: MenuItemData = {
        key: "file",
        label: <div className="menu-bar-button">File</div>,
        items: [
            {
                key: "new",
                label: "New",
                delay: 0,
                items: [
                    {
                        key: "level",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.level} alt="" />
                            <span>Level</span>
                        </div>),
                        callback: () => console.log("New level!"),
                    },
                    {
                        key: "world",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.world} alt="" />
                            <span>World</span>
                        </div>),
                    },
                    {
                        key: "game",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.game} alt="" />
                            <span>Game</span>
                        </div>),
                    },
                    {
                        key: "resource-pack",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.manifest} alt="" />
                            <span>Resource pack</span>
                        </div>),
                    },
                    {
                        key: "entity",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.entity} alt="" />
                            <span>Entity</span>
                        </div>),
                    },
                    {
                        key: "tile",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.tile} alt="" />
                            <span>Tile</span>
                        </div>),
                    },
                ]
            },
            {
                key: "open",
                label: "Open",
                callback: () => console.log("Open level!"),
            },
            {
                key: "save",
                label: "Save",
            },
            {
                key: "save-copy",
                label: "Save copy",
                
            }
        ]
    };
    const editData: MenuItemData = {
        key: "edit",
        label: <div className="menu-bar-button">Edit</div>,
        items: [
            {
                key: "preferences",
                label: "Preferences"
            },
        ]
    };

    return (
        <div className="menu-bar">
            <NestedDropdown
                menuItemsData={fileData}
                MenuProps={{
                    elevation: 0, // shadows, which are removed globally anyway
                    classes: {
                        root: "titlebar-menu-bar-root",
                        paper: "menu-bar-paper",
                        list: "menu-bar-list",
                    },
                }}
                ButtonProps={{
                    classes: {
                        root: "menu-bar-section",
                    },
                }}
            />
            <NestedDropdown
                menuItemsData={editData}
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
                    },
                }}
            />
        </div>
    );
}

export default MenuBar;

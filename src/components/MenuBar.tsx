import { Menu } from '@mantine/core';
import { MenuItemData, NestedDropdown } from '.lib/mui-nested-menu';
import React, { useEffect } from 'react';
import { FileIcons } from 'icons';
import Ipc from 'main/ipc/ipcRenderer';
import { useAppContext } from 'context/useAppContext';
import { useUserContext } from 'context/useUserContext';
import compileLevel from 'compiler/LevelCompiler';
import { Level } from 'models/Level';
import { useDisclosure } from '@mantine/hooks';
import CreateProjectModal from './CreateProjectModal';

export interface MenuBarProps {
    
}

function MenuBar (props: MenuBarProps) {
    const { resourcePacks } = useAppContext();
    const userCtx = useUserContext();

    const [newProjOpened, {
        open: openNewProj,
        close: closeNewProj,
    }] = useDisclosure(false);

    useEffect(() => {
        console.log(resourcePacks);
    }, [resourcePacks]);

    const fileData: MenuItemData = {
        key: "file",
        label: <div className="menu-bar-button">File</div>,
        items: [
            {
                key: "new-project",
                label: "New project",
                callback: handleNewProject,
            },
            {
                key: "open-project",
                label: "Open project",
                callback: handleOpenProject,
            },
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
                        callback: handleNew_level,
                    },
                    {
                        key: "world",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.world} alt="" />
                            <span>World</span>
                        </div>),
                        callback: handleNew_world,
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
                        callback: handleNew_entity,
                    },
                    {
                        key: "tile",
                        label: (<div className="menu-bar-option-with-icon">
                            <img src={FileIcons.tile} alt="" />
                            <span>Tile</span>
                        </div>),
                        callback: handleNew_tile,
                    },
                ]
            },
            {
                key: "open",
                label: "Open",
                callback: handleOpenDocument,
            },
            {
                key: "save",
                label: "Save",
                callback: handleSave,
            },
            {
                key: "save-copy",
                label: "Save copy",
                callback: handleSaveCopy,
            },
            {
                key: "compile",
                label: "Compile",
                callback: handleCompile,
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

    return (<>
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
                    marginThreshold: 0,
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
        <CreateProjectModal
            key={newProjOpened.toString()}
            opened={newProjOpened}
            onClose={closeNewProj}
            centered
            closeOnEscape={false}
            closeOnClickOutside={false}
        />
    </>);

    function handleNewProject () {
        openNewProj();
    }

    function handleOpenProject () {
        userCtx.openProject();
    }

    function handleNew_level () {
        userCtx.createNewLevel();
    }

    function handleNew_world () {
        userCtx.createNewWorld();
    }

    function handleNew_entity () {
        userCtx.createNewEntity();
    }

    function handleNew_tile () {
        userCtx.createNewTile();
    }

    function handleOpenDocument () {
        userCtx.openDocument();
    }

    function handleSave () {
        userCtx.saveDocument(userCtx.getActiveDocument());
    }

    function handleSaveCopy () {
        userCtx.saveDocumentCopy(userCtx.getActiveDocument());
    }

    function handleCompile () {
        const doc = userCtx.getActiveDocument();

        if (doc.content.type === 'level') {
            const level = doc.content as Level;

            const pack = resourcePacks.find(
                r => r.folderName === level.resourcePack
            );
            if (!pack) return;

            const binary = compileLevel(pack, level);
            console.log("output", binary);
            userCtx.saveBinary('level', binary);
        }
    }
}

export default MenuBar;

const LocalStorage = {
    directories: {
        projects: {
            get: () => localStorage.getItem("directories/projects"),
            set: (v: string) => localStorage.setItem("directories/projects", v),
        }
    },
    levelEditor: {
        panels: {
            paletteWidth: {
                get: () => {
                    return Number(
                        localStorage.getItem('level-editor/panels/palette-width')
                    );
                },
                set: (v: Number) => {
                    localStorage.setItem(
                        'level-editor/panels/palette-width',
                        v.toString()
                    );
                }
            }
        }
    }
};

export default LocalStorage;
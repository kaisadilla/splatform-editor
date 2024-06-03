const LocalStorage = {
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
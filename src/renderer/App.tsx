import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import { Tooltip } from 'react-tooltip';
import { DEFAULT_TOOLTIP_ID } from 'names';
import Window from 'Window';
import { MantineProvider, createTheme as createMantineTheme } from '@mantine/core';
import { Shadows, ThemeProvider, createTheme as createMuiTheme } from '@mui/material';
import { AppContextProvider } from 'context/useAppContext';
import { UserContextProvider } from 'context/useUserContext';
import loader from '@monaco-editor/loader';
import * as monaco from 'monaco-editor';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowPointer, faBrush, faEraser, faExpand, faEyeDropper, faEyeDropperEmpty, faFillDrip, faPaintBrush, faPaintbrush, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

import '@mantine/core/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-material-symbols/sharp'; // 'rounded' | 'sharp' | 'outlined'.
import darkTheme from 'styles/main.scss';

import "@pixi/unsafe-eval";

export default function App () {
    // TODO: Themes!
    //document.documentElement.style.setProperty('--color-primary', "#00ffff");

    const muiTheme = createMuiTheme({
        components: {
            MuiButtonBase: {
                defaultProps: {
                    disableRipple: true,
                }
            },
        },
        transitions: {
            create: () => 'none', // disable all transitions
        },
        shadows: new Array(25).fill("none") as Shadows
    })

    loader.config({ monaco });
    loader.init().then(monacoInstance => { /* ... */ });

    initFontAwesome();
    
    return (
        <ThemeProvider theme={muiTheme}>
        <MantineProvider>

        <AppContextProvider>
        <UserContextProvider>

            <div className="app" style={darkTheme}>
                <Window />
            </div>
            <Tooltip
                id={DEFAULT_TOOLTIP_ID}
                className="tooltip default-tooltip"
            />

        </UserContextProvider>
        </AppContextProvider>

        </MantineProvider>
        </ThemeProvider>
    );
}

function initFontAwesome () {
    library.add(
        faArrowPointer,
        faEraser,
        faExpand,
        faEyeDropper,
        faEyeDropperEmpty,
        faFillDrip,
        faPaintbrush,
        faUpDownLeftRight,
    );
}
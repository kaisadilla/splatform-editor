import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import { Tooltip } from 'react-tooltip';
import { DEFAULT_TOOLTIP_ID } from 'names';
import Window from 'Window';
import { MantineProvider, createTheme as createMantineTheme } from '@mantine/core';
import { Shadows, ThemeProvider, createTheme as createMuiTheme } from '@mui/material';

import darkTheme from 'styles/main.scss';
import '@mantine/core/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-material-symbols/sharp'; // 'rounded' | 'sharp' | 'outlined'.
import { AppContextProvider } from 'context/useAppContext';

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
    
    return (
        <ThemeProvider theme={muiTheme}>
        <MantineProvider>

        <AppContextProvider>

            <div className="app" style={darkTheme}>
                <Window />
            </div>
            <Tooltip
                id={DEFAULT_TOOLTIP_ID}
                className="tooltip default-tooltip"
            />
        
        </AppContextProvider>

        </MantineProvider>
        </ThemeProvider>
    );
}
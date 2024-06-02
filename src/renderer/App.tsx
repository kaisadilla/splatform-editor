import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import { Tooltip } from 'react-tooltip';
import darkTheme from 'styles/main.scss';
import 'react-tooltip/dist/react-tooltip.css';
import { DEFAULT_TOOLTIP_ID } from 'names';
import Window from 'Window';

export default function App () {
    // TODO: Themes!
    //document.documentElement.style.setProperty('--color-primary', "#00ffff");
    
    return (
        <>
            <div className="window" style={darkTheme}>
                <Window />
            </div>
            <Tooltip
                id={DEFAULT_TOOLTIP_ID}
                className="tooltip default-tooltip"
            />
        </>
    );
}
import { createTheme } from '@mui/material';

declare module '@mui/material' {
    interface Theme {
        signIn: {
            gray: string;
            lightgray: string;
        };
        JEI: {
            lightgray: '#B9B6B6';
            darkgray: '#898989';
            dark: '#000000DE';
        };
    }
    interface ThemeOptions {
        signIn?: {
            gray?: string;
            lightgray?: string;
        };
        JEI?: {
            lightgray?: '#B9B6B6';
            darkgray?: '#898989';
            dark?: '#000000DE';
        };
    }
}

const theme = createTheme({
    signIn: {
        gray: '#A3A5A5',
        lightgray: '#DDDDDD'
    },
    JEI: {
        lightgray: '#B9B6B6',
        darkgray: '#898989',
        dark: '#000000DE'
    }
});

export default theme;

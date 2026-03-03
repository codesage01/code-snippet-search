import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#a855f7', light: '#c084fc', dark: '#7c3aed' },
        secondary: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
        background: { default: '#0f0a1e', paper: '#1a1035' },
        surface: { main: '#221844' },
        text: { primary: '#f1f0f8', secondary: '#a89cc8' },
        divider: 'rgba(168,156,200,0.15)',
        success: { main: '#22c55e' },
        error: { main: '#f87171' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 10,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: '#1a1035',
                    border: '1px solid rgba(168,156,200,0.12)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 6, fontWeight: 600, fontSize: '0.72rem' },
            },
        },
    },
});

export default theme;

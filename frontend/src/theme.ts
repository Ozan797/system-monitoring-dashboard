import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // dark mode gives a modern look
    primary: {
      main: '#1976d2', // modern blue
    },
    secondary: {
      main: '#9c27b0', // modern purple
    },
    background: {
      default: '#121212', // dark background
      paper: '#1e1e1e',   // slightly lighter paper for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  spacing: 8, // base spacing unit
});

export default theme;

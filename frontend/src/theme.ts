import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Use dark mode for a modern look
    primary: {
      main: '#00bcd4', // A modern teal colour
    },
    secondary: {
      main: '#ff5722', // A contrasting deep orange
    },
    background: {
      default: '#121212', // Dark background for the whole app
      paper: '#1d1d1d',   // Slightly lighter background for paper components
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  spacing: 8, // Base spacing unit
});

export default theme;

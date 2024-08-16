"use client"; 

import { createTheme } from '@mui/material/styles';

// Define a custom font (e.g., Proxima Nova)
const customFont = "'Proxima Nova', sans-serif";

const theme = createTheme({
  palette: {
    mode: 'dark', // Dark theme mode
    primary: {
      main: '#b86fc6', // A more vibrant purple for primary elements
      contrastText: '#ffffff', // Ensure text on primary elements is readable
    },
    secondary: {
      main: '#03dac6', // A vibrant teal for secondary elements
      contrastText: '#000000', // Text color for contrast on secondary elements
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',   // Slightly lighter background for paper components
    },
    text: {
      primary: '#ffffff', // Bright text for readability
      secondary: '#b0bec5', // Softer secondary text
    },
    action: {
      active: '#03dac6', // Active elements color (like icons or selected buttons)
    },
  },
  typography: {
    fontFamily: customFont, // Apply the custom font globally
    h1: {
      fontFamily: customFont,
      fontWeight: 700,
    },
    h2: {
      fontFamily: customFont,
      fontWeight: 600,
    },
    body1: {
      fontFamily: customFont,
      fontWeight: 400,
    },
    button: {
      fontFamily: customFont,
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents all-caps in buttons
          fontWeight: 'bold', // Makes button text bold for emphasis
          borderRadius: '8px', // Rounded button corners for a modern look
        },
        containedPrimary: {
          backgroundColor: '#b86fc6',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#9c5bb0', // Slightly darker shade on hover
          },
        },
        containedSecondary: {
          backgroundColor: '#03dac6',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#02cbb2', // Slightly darker shade on hover
          },
        },
      },
    },
  },
});

export default theme;

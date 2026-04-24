import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      dark: '#235749',
      main: '#35836d',
      light: '#a8cac0',
      contrastText: '#ffffff',
    },
    error: {
      dark: '#b71c1c',
      main: '#d32f2f',
      light: '#feebee',
      contrastText: '#ffffff',
    },
    info: {
      dark: '#01579b',
      main: '#03a9f4',
      light: '#e1f5fe',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
      disabled: '#9e9e9e',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: "'Roboto', 'Noto Sans JP', sans-serif",
    fontSize: 14,
    h1: { fontSize: '28px', fontWeight: 700 },
    h2: { fontSize: '24px', fontWeight: 700, lineHeight: 1.5 },
    h3: { fontSize: '20px', fontWeight: 700, lineHeight: 1.5 },
    h4: { fontSize: '16px', fontWeight: 700, lineHeight: 1.5 },
    body1: { fontSize: '16px', fontWeight: 400, lineHeight: 1.8 },
    body2: { fontSize: '14px', fontWeight: 400, lineHeight: 1.57 },
    caption: { fontSize: '12px', fontWeight: 400, lineHeight: 1.66 },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: 42,
          padding: '8px 22px',
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.46px',
          '&:hover': { boxShadow: 'none' },
        },
        sizeSmall: {
          height: 30,
          padding: '4px 10px',
          fontSize: '13px',
        },
        contained: {
          boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
          },
        },
        outlined: {
          borderColor: 'rgba(53,131,109,0.5)',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 26,
          fontSize: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#eeeeee',
            fontWeight: 500,
            fontSize: '14px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#e2edea',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          fontSize: '14px',
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0px 4px 6px 0px rgba(5,32,15,0.06)',
          borderBottom: '1px solid #eceff1',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#e2edea',
            color: '#35836d',
            '&:hover': { backgroundColor: '#a8cac0' },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#35836d',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#35836d',
          },
        },
      },
    },
  },
});

export default theme;

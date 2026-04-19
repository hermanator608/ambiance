import { createTheme } from '@mui/material/styles';
import { common } from '@mui/material/colors';

//Theme for User UI
export const theme = createTheme({
  palette: {
    primary: {
      main: common.white
    },
    secondary: {
      main: common.black
    }
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(0,0,0,0.55)',
          backgroundImage: 'none',
          color: common.white,
        },
        listbox: {
          color: common.white,
        },
        option: {
          color: common.white,
          '&.Mui-focused': {
            filter: 'var(--brown-glow-drop-shadow)',
            backgroundColor: 'rgba(0,0,0,0.35)',
          },
          '&[aria-selected="true"]': {
            filter: 'var(--brown-glow-drop-shadow)',
            backgroundColor: 'rgba(0,0,0,0.35)',
          },
        },
        groupLabel: {
          color: common.white,
          backgroundColor: 'black',
          fontWeight: 700,
          zIndex: 1,
        },
        input: {
          color: common.white
        },
        endAdornment: {
          button: {
            color: common.white
          }
        },
        clearIndicator: {
          color: common.white
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: common.white,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: common.white,
          },
          '&:hover': {
            filter: 'var(--white-glow-drop-shadow)',
          },
        },
        notchedOutline: {
          borderColor: common.white
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ':hover .MuiOutlinedInput-notchedOutline': {
              borderColor: common.white
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: common.white
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: common.white
        }
      }
    }
  }
});

//Dark mode Theme for Admin and Login interface
export const adminTheme = createTheme({
  palette: {
    mode: 'dark',
  },

});

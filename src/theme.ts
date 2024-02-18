import { createTheme } from '@mui/material/styles';
import { common } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: common.white
    },

  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
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
        notchedOutline: {
          borderColor: common.white
        },
        root: {
          "&.Mui-focused": {
            "borderColor": "#fff"
          }
        }
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
    }
  }
});

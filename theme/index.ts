import { ThemeOptions, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: "6rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  spacing: 8,
  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    //       border: 0,
    //       borderRadius: 3,
    //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    //       color: 'white',
    //       height: 48,
    //       padding: '0 30px',
    //     },
    //   },
    // },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;

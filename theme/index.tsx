import { ThemeOptions, createTheme } from "@mui/material/styles";

import NextLink from "next/link";
import { forwardRef } from "react";

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  return <NextLink ref={ref} {...props} />;
});

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
    },
    secondary: {
      main: "#E5E5E5",
    },
    background: {
      default: "#333333",
      paper: "#333333",
    },
    success: {
      main: "#38ef7d",
      dark: "#38ef7d",
    },
  },
  typography: {
    allVariants: {
      color: "white",
      fontFamily: "inherit",
    },
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: "4rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "2rem",
      lineHeight: "3rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
    },
  },

  spacing: 8,

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
          borderRadius: "0px !important",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
        disableRipple: true,
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;

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
  },
  typography: {
    allVariants: {
      color: "white",
    },
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: "4rem",
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

import { amber, deepOrange, grey } from "@mui/material/colors";

import NextLink from "next/link";
import { forwardRef } from "react";
import merge from "ts-deepmerge";

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  return <NextLink ref={ref} {...props} />;
});

export const getThemeOptions = (mode: string) => {
  let options = {
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
        // color: "white",
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
            textTransform: "none",
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
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: "0px !important",
            border: "1px solid white !important",
            backgroundColor: "#FFF",
            color: "black",
          },
        },
      },
    },
  };

  if (mode === "dark") {
    options = merge(options, {
      palette: {
        mode: "dark",
        primary: {
          main: "#FFFFFF",
        },
        secondary: {
          main: "#FFFFFF",
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
          color: "#FFFFFF",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              color: "#FFFFFF",
            },
            containedSecondary: {
              color: "#000000",
              "&:hover": {
                backgroundColor: "#E5E5E5",
              },
            },
          },
        },
      },
    });
    console.log(options);
  } else if (mode === "light") {
    options = merge(options, {
      palette: {
        mode: "light",
        primary: {
          main: "#FFFFFF",
        },
        secondary: {
          main: "#E5E5E5",
        },
        background: {
          default: "#FFFFFF",
          paper: "#FFFFFF",
        },
        success: {
          main: "#38ef7d",
          dark: "#38ef7d",
        },
      },
      typography: {
        allVariants: {
          color: "black",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              color: "black",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "white",
              },
            },
          },
        },
      },
    });
  }

  return options;
};

// const theme = createTheme(themeOptions);

// export default theme;

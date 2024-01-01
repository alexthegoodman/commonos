"use client";

import { ColorModeContext } from "@/context/ColorModeContext";
import {
  LauncherContext,
  LauncherContextReducer,
  LauncherContextState,
} from "@/context/LauncherContext";
import { themeOptions, getThemeOptions } from "@/theme";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useDarkMode, useLocalStorage } from "usehooks-ts";

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  console.log("isDarkMode", isDarkMode);

  const [mode, setMode] = useState<"light" | "dark">(
    // isDarkMode ? "dark" : "light"
    "dark"
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        toggle();
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  const [state, dispatch] = useReducer(
    LauncherContextReducer,
    LauncherContextState
  );

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LauncherContext.Provider value={{ state, dispatch }}>
            {children}
          </LauncherContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
      <style jsx global>{`
        *::selection {
          background: #38ef7d;
          color: #000;
        }
      `}</style>
    </>
  );
}
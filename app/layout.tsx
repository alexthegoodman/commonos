"use client";

import { ColorModeContext } from "@/context/ColorModeContext";
import {
  LauncherContext,
  LauncherContextReducer,
  LauncherContextState,
} from "@/context/LauncherContext";
import { themeOptions, getThemeOptions } from "@/theme";
import { ThemeProvider, createTheme } from "@mui/material";
import { Inter } from "next/font/google";
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useDarkMode, useLocalStorage } from "usehooks-ts";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
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
    <html lang="en">
      <body
        className={inter.className}
        style={{
          margin: 0,
        }}
      >
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
      </body>
    </html>
  );
}

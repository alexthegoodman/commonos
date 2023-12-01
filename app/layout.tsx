"use client";

import {
  LauncherContext,
  LauncherContextReducer,
  LauncherContextState,
} from "@/context/LauncherContext";
import theme from "@/theme";
import { ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { useReducer } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    LauncherContextReducer,
    LauncherContextState
  );

  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <ThemeProvider theme={theme}>
          <LauncherContext.Provider value={{ state, dispatch }}>
            {children}
          </LauncherContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

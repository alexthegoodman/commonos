"use client";

import SiteHeader from "@/components/site/nav/SiteHeader";
import { LauncherContext } from "@/context/LauncherContext";
import { Box, styled } from "@mui/material";
import { useContext } from "react";

const Background = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Background>
      <SiteHeader />
      <Box mt={8}>{children}</Box>
    </Background>
  );
}

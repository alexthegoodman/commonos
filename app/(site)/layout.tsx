"use client";

import SiteFooter from "@/components/site/nav/SiteFooter";
import SiteHeader from "@/components/site/nav/SiteHeader";
import { Box, styled } from "@mui/material";

const Background = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Background>
      <SiteHeader />
      <Box mt={8}>{children}</Box>
      <SiteFooter />
    </Background>
  );
}

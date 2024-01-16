"use client";

import LandingFooter from "@/components/core/landing/LandingFooter";
import LandingHeader from "@/components/core/landing/LandingHeader";
import { Box, styled } from "@mui/material";

const Background = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Background>
      <LandingHeader />
      <Box mt={8}>{children}</Box>
      <LandingFooter />
    </Background>
  );
}

"use client";

import PrimaryHeader from "@/components/core/nav/PrimaryHeader";
import PrimaryTabs from "@/components/core/nav/PrimaryTabs";
import { LauncherContext } from "@/context/LauncherContext";
import { Box, styled } from "@mui/material";
import { useContext } from "react";

const Background = styled("main")(({ theme }) => ({
  width: "100%",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const Container = styled("div")(({ theme }) => ({
  maxWidth: "1400px",
  width: "100%",
  margin: "0 auto",
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useContext(LauncherContext);

  console.info("LauncherContext state", state);

  return (
    <Background>
      <Container>
        <PrimaryHeader />
        <PrimaryTabs />
        <Box>{children}</Box>
      </Container>
    </Background>
  );
}

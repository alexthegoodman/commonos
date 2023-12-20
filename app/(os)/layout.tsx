"use client";

import PrimaryHeader from "@/components/core/nav/PrimaryHeader";
import PrimaryTabs from "@/components/core/nav/PrimaryTabs";
import { LauncherContext } from "@/context/LauncherContext";
import { Box, styled } from "@mui/material";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const Background = styled("main")(({ theme }) => ({
  width: "100%",
  height: "100vh",
  // backgroundColor: theme.palette.background.default,
  overflowY: "scroll",

  background: "linear-gradient(355deg, #b92b27, #1565C0)",
  backgroundSize: "400% 400%",
  animation: "AnimationName 15s ease infinite",
}));

const Container = styled("div")(({ theme, hasSidebar }) => ({
  maxWidth: hasSidebar ? "1600px" : "1400px",
  paddingRight: hasSidebar ? "400px" : "0px",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useContext(LauncherContext);
  const pathname = usePathname();

  // use regex to check if pathname includes /slides/ or /sheets/ and a id
  let hasSidebar = /\/(slides|sheets|documents|drawings)\/[a-zA-Z0-9]+/.test(
    pathname
  );

  console.info("LauncherContext state", state);

  return (
    <Background>
      <Container hasSidebar={hasSidebar}>
        <PrimaryHeader />
        <PrimaryTabs />
        <Box>{children}</Box>
      </Container>
      <style jsx global>{`
        @-webkit-keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
        @-moz-keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
        @-o-keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
        @keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
      `}</style>
    </Background>
  );
}

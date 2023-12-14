"use client";

import PrimaryPromptForm from "@/components/core/forms/PrimaryPromptForm";
import AppGrid from "@/components/core/launcher/AppGrid";
import LauncherFooter from "@/components/core/launcher/LauncherFooter";
import { Box, Typography, styled } from "@mui/material";
import Link from "next/link";

const LauncherBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(355deg, #26e8b6, #ff1de8)",
  backgroundSize: "400% 400%",

  // -webkit-animation: AnimationName 30s ease infinite;
  // -moz-animation: AnimationName 30s ease infinite;
  // -o-animation: AnimationName 30s ease infinite;
  animation: "AnimationName 9s ease infinite",
}));

export default function Launcher() {
  return (
    <>
      <LauncherBox display="flex" flexDirection="column" alignItems="center">
        <Box
          boxSizing={"border-box"}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          maxWidth={450}
          width="100%"
          height="calc(100vh - 64px)"
          paddingBottom="200px"
        >
          <PrimaryPromptForm />
        </Box>

        <LauncherFooter />
        {/* <AppGrid /> */}
      </LauncherBox>
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
    </>
  );
}

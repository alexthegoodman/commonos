"use client";

import PrimaryPromptForm from "@/components/core/forms/PrimaryPromptForm";
import AppGrid from "@/components/core/launcher/AppGrid";
import LauncherFooter from "@/components/core/launcher/LauncherFooter";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Launcher() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
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
    </Box>
  );
}

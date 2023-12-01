"use client";

import PrimaryPromptForm from "@/components/core/forms/PrimaryPromptForm";
import AppGrid from "@/components/core/launcher/AppGrid";
import LauncherFooter from "@/components/core/launcher/LauncherFooter";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Launcher() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box maxWidth={450} width="100%">
        <PrimaryPromptForm />
      </Box>

      <LauncherFooter />
      {/* <AppGrid /> */}
    </Box>
  );
}

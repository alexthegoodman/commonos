"use client";

import DocumentTree from "@/components/documents/nav/DocumentTree";
import ProjectPicker from "@/components/core/nav/ProjectPicker";
import { Box, Button, Typography, styled } from "@mui/material";
import { useState } from "react";
import {
  CmContent,
  CmSidebar,
  MobileSideButton,
} from "@/components/core/layout/Wrapper";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="row">
      <MobileSideButton
        onClick={() => setMobileOpen(!mobileOpen)}
        variant="contained"
        color="secondary"
      >
        Browse Documents
      </MobileSideButton>
      <CmSidebar mobileOpen={mobileOpen}>
        <DocumentTree />
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

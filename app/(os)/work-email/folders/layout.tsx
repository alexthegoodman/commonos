"use client";

import { Box, Button, Link, Typography, styled } from "@mui/material";
import { useState } from "react";
import {
  CmContent,
  CmSidebar,
  MobileSideButton,
} from "@/components/core/layout/Wrapper";
import InboxList from "@/components/work-email/nav/InboxList";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="row">
      <MobileSideButton
        onClick={() => setMobileOpen(!mobileOpen)}
        variant="contained"
        color="secondary"
      >
        Browse Folders
      </MobileSideButton>
      <CmSidebar mobileOpen={mobileOpen}>
        <InboxList />
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

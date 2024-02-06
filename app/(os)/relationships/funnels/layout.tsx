"use client";

import { Box, Button, Typography, styled } from "@mui/material";
import { useState } from "react";
import {
  CmContent,
  CmSidebar,
  MobileSideButton,
} from "@/components/core/layout/Wrapper";
import FunnelList from "@/components/relationships/nav/FunnelList";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="row">
      <MobileSideButton
        onClick={() => setMobileOpen(!mobileOpen)}
        variant="contained"
        color="secondary"
      >
        Browse Funnels
      </MobileSideButton>
      <CmSidebar mobileOpen={mobileOpen}>
        <FunnelList />
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

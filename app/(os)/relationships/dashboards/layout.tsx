"use client";

import { Box, Button, Typography, styled } from "@mui/material";
import { useState } from "react";
import {
  CmContent,
  CmSidebar,
  MobileSideButton,
} from "@/components/core/layout/Wrapper";
import DashboardList from "@/components/relationships/nav/DashboardList";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="row">
      <MobileSideButton
        onClick={() => setMobileOpen(!mobileOpen)}
        variant="contained"
        color="secondary"
      >
        Browse Dashboards
      </MobileSideButton>
      <CmSidebar mobileOpen={mobileOpen}>
        <DashboardList />
      </CmSidebar>
      <CmContent paddingLeft={2}>{children}</CmContent>
    </Box>
  );
}

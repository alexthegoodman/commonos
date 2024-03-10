"use client";

import { Box, Button, Link, Typography, styled } from "@mui/material";
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
        Browse Settings
      </MobileSideButton>
      <CmSidebar mobileOpen={mobileOpen}>
        <Typography variant="overline">Send Email Settings</Typography>
        <Box display="flex" flexDirection="column" mt={1} gap={1}>
          <Link href="/send-email/settings/domain/">Domain</Link>
          <Link href="/send-email/settings/developers/">Developers</Link>
        </Box>
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

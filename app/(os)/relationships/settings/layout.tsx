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
        <Typography variant="overline">Relationships Settings</Typography>
        <Box display="flex" flexDirection="column" mt={1} gap={1}>
          <Link href="/relationships/settings/contacts/">Contacts</Link>
          <Link href="/relationships/settings/companies/">Companies</Link>
        </Box>
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

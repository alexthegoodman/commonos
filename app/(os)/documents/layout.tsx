"use client";

import DocumentTree from "@/components/documents/nav/DocumentTree";
import { Box, Typography, styled } from "@mui/material";

const CmSidebar = styled("aside")(({ theme }) => ({
  width: "400px",
  height: "100%",
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: "auto",
}));

const CmContent = styled("section")(({ theme }) => ({
  width: "calc(100% - 400px)",
  height: "100%",
  // backgroundColor: theme.palette.background.paper,
  // borderRight: `1px solid ${theme.palette.divider}`,
  overflow: "auto",
}));

export default function Layout({ children }) {
  return (
    <Box display="flex" flexDirection="row">
      <CmSidebar>
        <DocumentTree />
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

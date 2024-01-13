"use client";

import DocumentTree from "@/components/documents/nav/DocumentTree";
import ProjectPicker from "@/components/core/nav/ProjectPicker";
import { Box, Button, Typography, styled } from "@mui/material";
import { useState } from "react";

const CmSidebar = styled("aside")(({ theme, mobileOpen }) => ({
  width: "400px",
  height: "100%",
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: "auto",
  [theme.breakpoints.down("xl")]: {
    width: "300px",
  },
  [theme.breakpoints.down("md")]: {
    width: "250px",
  },
  [theme.breakpoints.down("sm")]: {
    display: mobileOpen ? "block" : "none",
    position: "absolute",
    zIndex: 20,
    top: "auto",
    left: "50px",
    right: "0px",
    height: "100%",
    backgroundColor: theme.palette.background.default,
  },
}));

const CmContent = styled("section")(({ theme }) => ({
  width: "calc(100% - 400px)",
  height: "100%",
  overflow: "auto",
  [theme.breakpoints.down("xl")]: {
    width: "calc(100% - 300px)",
  },
  [theme.breakpoints.down("md")]: {
    width: "calc(100% - 250px)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const MobileSideButton = styled(Button)(({ theme }) => ({
  writingMode: "vertical-rl",
  // textOrientation: "upright",
  transform: "rotate(180deg)",
  letterSpacing: "3px",
  height: "300px",
  zIndex: 5,
  color: "black",
  width: "50px",
  minWidth: "50px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

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
        <ProjectPicker />
        <DocumentTree />
      </CmSidebar>
      <CmContent>{children}</CmContent>
    </Box>
  );
}

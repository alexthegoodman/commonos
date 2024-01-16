"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";

const InnerWrappper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));

export default function LandingHeader() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <InnerWrappper>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              CommonOS
            </Typography>
            <Box
              sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "row" }}
            >
              <Button color="success" variant="contained" href="/sign-up">
                Sign Up
              </Button>
            </Box>
          </InnerWrappper>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

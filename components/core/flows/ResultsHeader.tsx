"use client";

import { AutoAwesome } from "@mui/icons-material";
import { Box, Button, Grid, Typography, styled } from "@mui/material";

export default function ResultsHeader() {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Typography variant="h2">Flow Results</Typography>
      <Button
        variant="contained"
        color="success"
        style={{ fontSize: "24px", padding: "10px 25px" }}
        //   endIcon={<AutoAwesome />}
      >
        Begin Creation
      </Button>
    </Box>
  );
}

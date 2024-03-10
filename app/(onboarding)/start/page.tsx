"use client";

import PrimaryPromptForm from "@/components/core/forms/PrimaryPromptForm";
import { Box, Typography } from "@mui/material";

export default function Start() {
  return (
    <>
      <Box display="block" maxWidth="600px" margin="0 auto">
        <Typography variant="h3" mb={1}>
          Getting Started
        </Typography>
        <Typography variant="body1" mb={2}>
          Begin your creation journey with a prompt
        </Typography>
        <PrimaryPromptForm />
      </Box>
    </>
  );
}

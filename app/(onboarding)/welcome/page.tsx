"use client";

import { Box, Typography } from "@mui/material";
// import HowItWorks from "@/components/core/onboarding/HowItWorks";
import dynamic from "next/dynamic";

const HowItWorksNoSSR = dynamic(
  () => import("@/components/core/onboarding/HowItWorks"),
  {
    ssr: false,
  }
);

export default function Welcome() {
  return (
    <Box display="block" maxWidth="600px" margin="0 auto">
      <Typography variant="h3" mb={1}>
        Welcome to CommonOS
      </Typography>
      <Typography variant="body1" mb={2}>
        This will explain how you can get your files (documents, sheets,
        presentations, etc) easily and quickly
      </Typography>
      <hr />
      <HowItWorksNoSSR />
    </Box>
  );
}

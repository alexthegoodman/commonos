"use client";

import { Wrapper } from "@/components/core/layout/Wrapper";
import { Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Box display="flex" justifyContent="center">
        {children}
      </Box>
    </Wrapper>
  );
}

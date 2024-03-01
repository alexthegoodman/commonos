"use client";

import { Wrapper } from "@/components/core/layout/Wrapper";
import { Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Box>{children}</Box>
    </Wrapper>
  );
}

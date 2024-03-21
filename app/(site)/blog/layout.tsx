"use client";

import BlogSidebar from "@/components/core/blog/BlogSidebar";
import { InnerWrapper } from "@/components/core/landing/InnerWrapper";
import { Box } from "@mui/material";

export default function BlogLayout({ children }) {
  return (
    <>
      <InnerWrapper>
        <Box display="flex" flexDirection="row">
          <BlogSidebar />
          <Box>{children}</Box>
        </Box>
      </InnerWrapper>
    </>
  );
}

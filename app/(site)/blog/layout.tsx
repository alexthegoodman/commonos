"use client";

import BlogSidebar from "@/components/core/blog/BlogSidebar";
import { InnerWrapper } from "@/components/core/landing/InnerWrapper";
import { Box } from "@mui/material";

export default function BlogLayout({ children }) {
  return (
    <>
      <InnerWrapper>
        <Box
          display="flex"
          sx={{ flexDirection: { sm: "row", xs: "column-reverse" } }}
        >
          <BlogSidebar />
          <Box sx={{ width: { md: "100%", lg: "1050px" }, my: "20px" }}>
            {children}
          </Box>
        </Box>
      </InnerWrapper>
    </>
  );
}

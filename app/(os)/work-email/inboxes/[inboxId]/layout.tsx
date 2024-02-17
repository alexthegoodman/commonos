"use client";

import { Box, Typography, styled } from "@mui/material";

const InboxWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  height: "100%",
}));

const ThreadsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "350px",
  height: "calc(100vh - 200px)",
  borderRight: "1px solid #e0e0e0",
  padding: "20px",
  overflowY: "auto",
}));

const ThreadItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "10px 0",
  borderBottom: "1px solid #e0e0e0",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

export default function Layout({ children = null }) {
  return (
    <>
      <InboxWrapper>
        <ThreadsWrapper>
          <Typography variant="overline">Your Threads</Typography>
          <ThreadItem>
            <Typography variant="body1">Thread 1</Typography>
            <Typography variant="caption">Last message preview...</Typography>
            <Typography variant="caption">01/01/20</Typography>
          </ThreadItem>
        </ThreadsWrapper>
        <Box>{children}</Box>
      </InboxWrapper>
    </>
  );
}

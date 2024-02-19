"use client";

import { Box, Button, Typography, styled } from "@mui/material";
import { usePathname } from "next/navigation";

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

const ThreadItem = styled(Box)(({ theme, active }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "10px 0",
  borderBottom: "1px solid #e0e0e0",
  cursor: "pointer",
  backgroundColor: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

export default function Layout({ params, children = null }) {
  const inboxId = params.inboxId;

  const pathname = usePathname();
  const lastSlug = pathname.split("/").pop();
  const isNewEmail = lastSlug === "new-email";

  console.info("inboxId", inboxId);

  return (
    <>
      <InboxWrapper>
        <ThreadsWrapper>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="overline">Your Threads</Typography>
            <Button
              variant="contained"
              color="success"
              href={`/work-email/inboxes/${inboxId}/new-email`}
            >
              New Email
            </Button>
          </Box>
          {isNewEmail && (
            <ThreadItem active={true}>
              <Typography variant="body1">New Email</Typography>
            </ThreadItem>
          )}
          <ThreadItem>
            <Typography variant="body1">Thread 1</Typography>
            <Typography variant="caption">Last message preview...</Typography>
            <Typography variant="caption">01/01/20</Typography>
          </ThreadItem>
        </ThreadsWrapper>
        <Box
          sx={{
            width: { xl: "calc(100vw - 900px)", md: "calc(100vw - 500px)" },
            paddingLeft: "20px",
          }}
        >
          {children}
        </Box>
      </InboxWrapper>
    </>
  );
}

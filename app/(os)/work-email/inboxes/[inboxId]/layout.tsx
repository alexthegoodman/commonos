"use client";

import { getInbox } from "@/fetchers/work-email";
import { Box, Button, Typography, styled } from "@mui/material";
import { usePathname } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const { DateTime } = require("luxon");

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

const ThreadItem = styled(Button)(({ theme, active }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "25px",
  // borderBottom: "1px solid #e0e0e0",
  border: "1px solid #e0e0e0",

  cursor: "pointer",
  textAlign: "left",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  backgroundColor: active ? "#99c7a2" : "transparent",
  color: active ? "white" : "#515151",
  boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
  marginBottom: "30px",
  "&:hover": {
    boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    "& p, & span": {
      color: active ? "#515151" : "#515151",
    },
  },
  "& p, & span": {
    color: active ? "white" : "#515151",
  },
}));

export default function Layout({ params, children = null }) {
  const inboxId = params.inboxId;
  const threadId = params.threadId;

  console.info("threadId", threadId);

  const pathname = usePathname();
  const lastSlug = pathname.split("/").pop();
  const isNewEmail = lastSlug === "new-email";

  console.info("inboxId", inboxId);

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: inboxData,
    error,
    isLoading,
  } = useSWR("inboxKey" + inboxId, () => getInbox(token, inboxId), {
    revalidateOnMount: true,
  });

  return (
    <>
      <InboxWrapper>
        <ThreadsWrapper>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6">Your Threads</Typography>
            <Button
              variant="contained"
              color="success"
              href={`/work-email/inboxes/${inboxId}/new-email`}
              size="small"
            >
              New Email
            </Button>
          </Box>
          {isNewEmail && (
            <ThreadItem active={true}>
              <Typography variant="body1">New Email</Typography>
            </ThreadItem>
          )}
          {inboxData?.threads.map((thread) => {
            if (!thread.mostRecentEmail) return null;

            const body = { __html: thread.mostRecentEmail.body };

            return (
              <ThreadItem
                key={thread.id}
                active={lastSlug === thread.id}
                href={`/work-email/inboxes/${inboxId}/${thread.id}`}
              >
                <Typography variant="body1">{thread.subject}</Typography>
                <Typography
                  variant="caption"
                  dangerouslySetInnerHTML={body}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                    height: "20px",
                    "& p": {
                      margin: 0,
                    },
                  }}
                />
                <Typography variant="caption">
                  {DateTime.fromISO(
                    thread.mostRecentEmail.createdAt
                  ).toLocaleString(DateTime.DATETIME_MED)}
                  ,{" "}
                  {DateTime.fromISO(
                    thread.mostRecentEmail.createdAt
                  ).toRelative()}
                </Typography>
              </ThreadItem>
            );
          })}
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

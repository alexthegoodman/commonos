"use client";

import { getInbox, myWorkEmailFolderTemplates } from "@/fetchers/work-email";
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
  const folderId = params.folderId;
  const templateId = params.templateId;

  console.info("templateId", templateId);

  const pathname = usePathname();
  const lastSlug = pathname.split("/").pop();
  const isNewTemplate = lastSlug === "new-template";

  console.info("folderId", folderId);

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: templateData,
    error,
    isLoading,
  } = useSWR(
    "workEmailFolderTemplatesKey" + folderId,
    () => myWorkEmailFolderTemplates(token, folderId),
    {
      revalidateOnMount: true,
    }
  );

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
            <Typography variant="h6">Your Templates</Typography>
            <Button
              variant="contained"
              color="success"
              href={`/work-email/folders/${folderId}/new-template`}
              size="small"
              style={{ minWidth: "80px" }}
            >
              New
            </Button>
          </Box>
          {isNewTemplate && (
            <ThreadItem active={true}>
              <Typography variant="body1">New Template</Typography>
            </ThreadItem>
          )}
          {templateData &&
            templateData.map((template) => {
              // if (!template.mostRecentEmail) return null;

              let body = template.body
                ? template.body
                : template.initialMarkdown;
              body = body.substr(0, 100);

              return (
                <ThreadItem
                  key={template.id}
                  active={lastSlug === template.id}
                  href={`/work-email/folders/${folderId}/${template.id}`}
                >
                  <Typography variant="body1">{template.subject}</Typography>
                  <Typography
                    variant="caption"
                    // dangerouslySetInnerHTML={body}
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
                  >
                    {body}
                  </Typography>
                  <Typography variant="caption">
                    {DateTime.fromISO(template.createdAt).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                    , {DateTime.fromISO(template.createdAt).toRelative()}
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

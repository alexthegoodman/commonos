"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import ComposeEmail from "@/components/work-email/editor/ComposeEmail";
import {
  getInbox,
  myThreadEmails,
  myWorkEmailFolderTemplates,
  sendWorkEmail,
} from "@/fetchers/work-email";
import { Warning } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Button,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

const EmailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "10px 0",
  borderBottom: "1px solid #e0e0e0",
}));

export default function EmailThread({
  folderId,
  templateId = null,
  templateData = null,
}) {
  //   const inboxId = params.inboxId;

  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  // const {
  //   data: inboxData,
  //   error,
  //   isLoading,
  // } = useSWR("inboxKey" + folderId, () => myWorkEmailFolderTemplates(token, folderId), {
  //   revalidateOnMount: true,
  // });

  // console.info("inboxData", inboxData);

  // const initialEmail = emails[0];
  // const draftEmail = emails.find((email) => email.draft);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [clearEffect, setClearEffect] = useState(0);

  // useEffect(() => {
  //   if (initialEmail) {
  //     setTo(initialEmail.to);
  //     setSubject("Re: " + initialEmail.subject);
  //   }
  // }, [initialEmail]);

  const handleBodyChange = (value) => {
    setBody(value);
  };

  // const handleSendEmail = async () => {
  //   let from = inboxData.username + "@" + inboxData.domain.domainName;
  //   console.info("Sending email", { inboxId, from, to, subject, body });

  //   const emailData = await sendWorkEmail(
  //     token,
  //     inboxId,
  //     threadId,
  //     to,
  //     subject,
  //     body
  //   );
  //   mutate("inboxKey" + inboxId, () => getInbox(token, inboxId));
  //   mutate("threadKey" + threadId, () =>
  //     myThreadEmails(token, emailData.thread.id)
  //   );
  //   setClearEffect(Date.now());

  //   router.push(`/work-email/inboxes/${inboxId}/${emailData.thread.id}`);
  // };

  // if (isLoading) return <PrimaryLoader />;

  return (
    <>
      <Box display="flex" flexDirection="column">
        <TextField
          placeholder="Subject"
          variant="outlined"
          sx={{ width: "400px", marginBottom: 3 }}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Box>
      {/* {folderId && templateData && (
        <Box>
          <Typography variant="h6">{templateData?.subject}</Typography>
          {emails.map((email) => {
            console.info("email", email);
            const isDraft = email.draft;
            const body = { __html: email.body };

            return (
              <EmailItem key={email.id}>
                <Typography variant="body1" dangerouslySetInnerHTML={body} />
              </EmailItem>
            );
          })}
        </Box>
      )} */}
      <Box sx={{ paddingRight: 5 }}>
        <ComposeEmail
          handleChange={handleBodyChange}
          clearEffect={clearEffect}
          initialMarkdown={templateData?.initialMarkdown || ""}
        />
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => {}}
        >
          Save Template
        </Button>
      </Box>
    </>
  );
}

"use client";

import ComposeEmail from "@/components/work-email/editor/ComposeEmail";
import { getInbox } from "@/fetchers/work-email";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function NewEmail({ params }) {
  const inboxId = params.inboxId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: inboxData,
    error,
    isLoading,
  } = useSWR("inboxKey" + inboxId, () => getInbox(token, inboxId), {
    revalidateOnMount: true,
  });

  console.info("inboxData", inboxData);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleBodyChange = (value) => {
    setBody(value);
  };

  const handleSendEmail = () => {
    let from = inboxData.username + "@" + inboxData.domain.domainName;
    console.info("Sending email", { from, to, subject, body });
  };

  return (
    <>
      <Box display="flex" flexDirection="column">
        <TextField
          placeholder="To"
          variant="outlined"
          sx={{ width: "400px", marginBottom: 1 }}
          onChange={(e) => setTo(e.target.value)}
        />
        <TextField
          placeholder="Subject"
          variant="outlined"
          sx={{ width: "400px", marginBottom: 2 }}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Box>
      <ComposeEmail handleChange={handleBodyChange} />
      <Box mt={2}>
        <Button variant="contained" color="success" onClick={handleSendEmail}>
          Send Email
        </Button>
      </Box>
    </>
  );
}

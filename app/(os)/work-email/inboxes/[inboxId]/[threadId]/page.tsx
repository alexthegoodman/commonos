"use client";

import EmailThread from "@/components/work-email/editor/EmailThread";
import { myThreadEmails } from "@/fetchers/work-email";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Thrad({ params }) {
  const inboxId = params.inboxId;
  const threadId = params.threadId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: emailData,
    error,
    isLoading,
  } = useSWR("threadKey" + threadId, () => myThreadEmails(token, threadId), {
    revalidateOnMount: true,
  });

  return (
    <>
      <EmailThread inboxId={inboxId} threadId={threadId} emails={emailData} />
    </>
  );
}

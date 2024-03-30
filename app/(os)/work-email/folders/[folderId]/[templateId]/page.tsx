"use client";

import EmailThread from "@/components/work-email/editor/EmailThread";
import { getWorkEmailTemplate, myThreadEmails } from "@/fetchers/work-email";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function EditTemplate({ params }) {
  const folderId = params.folderId;
  const templateId = params.templateId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: templateData,
    error,
    isLoading,
  } = useSWR(
    "workEmailTemplateKey" + templateId,
    () => getWorkEmailTemplate(token, templateId),
    {
      revalidateOnMount: true,
    }
  );

  return (
    <>
      <EmailThread
        folderId={folderId}
        templateId={templateId}
        templateData={templateData}
      />
    </>
  );
}

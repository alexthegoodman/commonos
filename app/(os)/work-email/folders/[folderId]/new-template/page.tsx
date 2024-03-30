"use client";

import EmailThread from "@/components/work-email/editor/EmailThread";

export default function NewTemplate({ params }) {
  const folderId = params.folderId;

  return (
    <>
      <EmailThread folderId={folderId} />
    </>
  );
}

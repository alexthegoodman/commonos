"use client";

import EmailThread from "@/components/work-email/editor/EmailThread";

export default function NewEmail({ params }) {
  const inboxId = params.inboxId;

  return (
    <>
      <EmailThread inboxId={inboxId} />
    </>
  );
}

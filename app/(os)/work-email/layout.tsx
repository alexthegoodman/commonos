"use client";

import PrimaryTabs from "@/components/core/nav/PrimaryTabs";

const relationshipTabs = [
  {
    id: "inboxes",
    label: "Inboxes",
    href: "/work-email/inboxes",
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/work-email/settings",
    badge: null,
  },
];

export default function Layout({ children = null }) {
  return (
    <>
      <PrimaryTabs tabs={relationshipTabs} pathNum={-1} />
      {children}
    </>
  );
}

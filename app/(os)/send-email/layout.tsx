"use client";

import PrimaryTabs from "@/components/core/nav/PrimaryTabs";

const relationshipTabs = [
  {
    id: "logs",
    label: "Logs",
    href: "/send-email/logs",
    badge: null,
  },
  {
    id: "templates",
    label: "Templates",
    href: "/send-email/templates",
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/send-email/settings",
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

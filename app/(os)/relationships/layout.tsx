"use client";

import PrimaryTabs from "@/components/core/nav/PrimaryTabs";

const relationshipTabs = [
  {
    id: "dashboards",
    label: "Dashboards",
    href: "/relationships/dashboards",
    badge: null,
  },
  {
    id: "funnels",
    label: "Funnels",
    href: "/relationships/funnels",
    badge: null,
  },
  {
    id: "companies",
    label: "Companies",
    href: "/relationships/companies",
    badge: null,
  },
  {
    id: "contacts",
    label: "Contacts",
    href: "/relationships/contacts",
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/relationships/settings",
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

"use client";

import PrimaryTabs from "@/components/core/nav/PrimaryTabs";

const relationshipTabs = [
  {
    id: "folders",
    label: "Folders",
    href: "/work-email/folders",
    badge: null,
  },
  // {
  //   id: "settings",
  //   label: "Settings",
  //   href: "/work-email/settings",
  //   badge: null,
  // },
];

export default function Layout({ children = null }) {
  return (
    <>
      <PrimaryTabs tabs={relationshipTabs} pathNum={-1} />
      {children}
    </>
  );
}

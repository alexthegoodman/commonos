"use client";

import PrimaryTabs from "@/components/core/nav/PrimaryTabs";

const contentTabs = [
  {
    id: "post-types",
    label: "Post Types",
    href: "/content/post-types",
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/content/settings",
    badge: null,
  },
];

export default function Layout({ children = null }) {
  return (
    <>
      <PrimaryTabs tabs={contentTabs} pathNum={-1} />
      {children}
    </>
  );
}

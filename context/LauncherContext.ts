import React, { useState, useReducer } from "react";

export const allTabs = [
  // {
  //   id: "launcher",
  //   label: "Launcher",
  //   href: "/launcher",
  //   badge: null,
  // },
  {
    id: "documents",
    label: "Documents",
    href: "/documents",
    badge: null,
  },
  {
    id: "slides",
    label: "Slides",
    href: "/slides",
    badge: null,
  },
  {
    id: "sheets",
    label: "Sheets",
    href: "/sheets",
    badge: null,
  },
  {
    id: "drawings",
    label: "Drawings",
    href: "/drawings",
    badge: null,
  },
  {
    id: "relationships",
    label: "Relationships",
    href: "/relationships",
    badge: null,
  },
  // {
  //   id: "analytics",
  //   label: "Analytics",
  //   href: "/analytics",
  //   badge: null,
  // },
  {
    id: "content",
    label: "Content",
    href: "/content",
    badge: null,
  },
  // {
  //   id: "send-email",
  //   label: "Send Email",
  //   href: "/send-email",
  //   badge: null,
  // },
  {
    id: "work-email",
    label: "Work Email",
    href: "/work-email",
    badge: null,
  },
  // {
  //   id: "rss",
  //   label: "RSS News",
  //   href: "",
  //   badge: "Coming Soon",
  // },
  // {
  //   id: "sounds",
  //   label: "Sounds",
  //   href: "",
  //   badge: "Coming Soon",
  // },
  // {
  //   id: "videos",
  //   label: "Videos",
  //   href: "",
  //   badge: "Coming Soon",
  // },
  // {
  //   id: "code",
  //   label: "Code",
  //   href: "/code",
  //   badge: "Coming Soon",
  // },
];

// // all tabs for now
// const testDefaultTabs = allTabs.map((tab) => ({
//   id: tab.id,
//   pinned: false,
// }));

export interface OpenTab {
  id: string;
  appId: string;
  // pinned: boolean;
}

export interface LauncherContextState {
  openTabs: OpenTab[];
  currentOrganizationId: string | null;
  currentProjectId: string | null;
}

export const LauncherContextState = {
  openTabs: [],
  currentOrganizationId: null,
  currentProjectId: null,
};

export const LauncherContextReducer = (
  state: LauncherContextState,
  action: any
) => {
  switch (action.type) {
    // case value:
    //   break;

    default:
      return {
        ...state,
        [action.type]: action.payload,
      };
      break;
  }
};

export const LauncherContext = React.createContext<{
  state: LauncherContextState;
  dispatch: React.Dispatch<any>;
}>({
  state: LauncherContextState,
  dispatch: () => undefined,
});

export const useLauncherContext = () =>
  React.useContext(LauncherContext) as unknown as Iterable<any>;

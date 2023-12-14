import React, { useState, useReducer } from "react";

export const allTabs = [
  {
    id: "launcher",
    label: "Launcher",
    href: "/launcher",
    badge: null,
  },
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
    id: "sounds",
    label: "Sounds",
    href: "/sounds",
    badge: "Coming Soon",
  },
  {
    id: "videos",
    label: "Videos",
    href: "/videos",
    badge: "Coming Soon",
  },
  // {
  //   id: "code",
  //   label: "Code",
  //   href: "/code",
  //   badge: "Coming Soon",
  // },
];

// all tabs for now
const testDefaultTabs = allTabs.map((tab) => ({
  id: tab.id,
  pinned: false,
}));

export interface OpenTab {
  id: string;
  pinned: boolean;
}

export interface LauncherContextState {
  openTabs: OpenTab[];
}

export const LauncherContextState = {
  openTabs: testDefaultTabs,
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

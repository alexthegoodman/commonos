import React, { useState, useReducer } from "react";

export const allTabs = [
  {
    id: "launcher",
    label: "Launcher",
    href: "/launcher",
  },
  {
    id: "documents",
    label: "Documents",
    href: "/documents",
  },
  {
    id: "slides",
    label: "Slides",
    href: "/slides",
  },
  {
    id: "sheets",
    label: "Sheets",
    href: "/sheets",
  },
  {
    id: "drawings",
    label: "Drawings",
    href: "/drawings",
  },
  {
    id: "sounds",
    label: "Sounds",
    href: "/sounds",
  },
  {
    id: "videos",
    label: "Videos",
    href: "/videos",
  },
  {
    id: "code",
    label: "Code",
    href: "/code",
  },
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

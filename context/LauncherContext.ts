import React, { useState, useReducer } from "react";

export const allTabs = [
  {
    id: "launcher",
    label: "Launcher",
    href: "/launcher",
    canClose: false,
  },
  {
    id: "documents",
    label: "Documents",
    href: "/documents",
    canClose: true,
  },
  {
    id: "slides",
    label: "Slides",
    href: "/slides",
    canClose: true,
  },
  {
    id: "sheets",
    label: "Sheets",
    href: "/sheets",
    canClose: true,
  },
  {
    id: "drawings",
    label: "Drawings",
    href: "/drawings",
    canClose: true,
  },
];

// for testing only
const testDefaultTabs = [
  {
    id: "launcher",
    pinned: false,
  },
  {
    id: "documents",
    pinned: false,
  },
  {
    id: "slides",
    pinned: false,
  },
];

export interface Tab {
  id: string;
  pinned: boolean;
}

export interface LauncherContextState {
  openTabs: Tab[];
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

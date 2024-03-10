import React, { useState, useReducer, Dispatch } from "react";
import { v4 as uuidv4 } from "uuid";

export interface RelationshipsDashboardsContextState {
  visuals: any[] | null;
}

export const RelationshipsDashboardsContextState = {
  visuals: [],
};

export const RelationshipsDashboardsContextReducer = (
  state: RelationshipsDashboardsContextState,
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

export const RelationshipsDashboardsContext = React.createContext<
  [RelationshipsDashboardsContextState, Dispatch<any>]
>([RelationshipsDashboardsContextState, () => undefined]);

export const useRelationshipsDashboardsContext = () =>
  React.useContext(RelationshipsDashboardsContext) as unknown as Iterable<any>;

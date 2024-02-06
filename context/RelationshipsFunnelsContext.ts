import React, { useState, useReducer, Dispatch } from "react";
import { v4 as uuidv4 } from "uuid";

export interface RelationshipsFunnelsContextState {
  zones: any[] | null;
}

export const RelationshipsFunnelsContextState = {
  zones: [
    {
      id: uuidv4(),
      name: "Step 1",
      cards: [],
    },
  ],
};

export const RelationshipsFunnelsContextReducer = (
  state: RelationshipsFunnelsContextState,
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

export const RelationshipsFunnelsContext = React.createContext<
  [RelationshipsFunnelsContextState, Dispatch<any>]
>([RelationshipsFunnelsContextState, () => undefined]);

export const useRelationshipsFunnelsContext = () =>
  React.useContext(RelationshipsFunnelsContext) as unknown as Iterable<any>;

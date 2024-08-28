import React, { useState, useReducer, Dispatch } from "react";

export interface DocumentsContextState {
  editorTitle: string;
  editorValue: string;
  editorJson: any;
  editorPlaintext: string;
  pages: any[] | null;
}

export const DocumentsContextState = {
  editorTitle: "",
  editorValue: "",
  editorJson: null,
  editorPlaintext: "",
  pages: [],
};

export const DocumentsContextReducer = (
  state: DocumentsContextState,
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

export const DocumentsContext = React.createContext<
  [DocumentsContextState, Dispatch<any>]
>([DocumentsContextState, () => undefined]);

export const useDocumentsContext = () =>
  React.useContext(DocumentsContext) as unknown as Iterable<any>;

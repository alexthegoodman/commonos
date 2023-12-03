import { gql } from "graphql-request";

export const newSheetMutation = gql`
  mutation NewSheetMutation {
    newSheet {
      id
    }
  }
`;

export const updateSheetMutation = gql`
  mutation UpdateSheet($sheetId: String!, $title: String, $context: String) {
    updateSheet(sheetId: $sheetId, title: $title, context: $context) {
      id
    }
  }
`;

export const mySheetsQuery = gql`
  query Sheets {
    mySheets {
      id
      title

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

export const sheetQuery = gql`
  query Sheet($sheetId: String!) {
    sheet(sheetId: $sheetId) {
      id
      title
      context

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

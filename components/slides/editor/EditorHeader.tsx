import * as React from "react";

import { useDocumentsContext } from "../../../context/DocumentsContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useCookies } from "react-cookie";
import graphClient from "../../../helpers/GQLClient";
import { updateDocumentMutation } from "../../../gql/document";
import { mutate } from "swr";
import { getDocumentsData } from "../../../fetchers/document";
import { Box, TextField } from "@mui/material";
const { DateTime } = require("luxon");

const EditorHeader = ({ title, setTitle }) => {
  const onTitleChange = (e: any) => {
    console.info("title change", e.target.value);
    setTitle(e.target.value);
  };

  return (
    <header>
      <Box pb={2}>
        <TextField
          onChange={onTitleChange}
          defaultValue={title}
          placeholder="Title"
          style={{
            width: "603px",
          }}
        />
      </Box>
    </header>
  );
};

export default EditorHeader;

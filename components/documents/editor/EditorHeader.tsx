import * as React from "react";

import { useDocumentsContext } from "../../../context/DocumentsContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useCookies } from "react-cookie";
import graphClient from "../../../helpers/GQLClient";
import { updateDocumentMutation } from "../../../gql/document";
import { mutate } from "swr";
import { getDocumentsData } from "../../../fetchers/document";
import { Box, TextField, Typography } from "@mui/material";
const { DateTime } = require("luxon");

const EditorHeader = ({
  documentId = "",
  documentData = null,
  refetchDocument = () => console.info("refetchDocument"),
}) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  graphClient.setupClient(token);

  const [{ editorJson, editorPlaintext, editorTitle, messages }, dispatch] =
    useDocumentsContext();
  const debouncedTitle = useDebounce(editorTitle, 500);
  const debouncedJson = useDebounce(editorJson, 500);
  const debouncedMessages = useDebounce(messages, 500);
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const updateDocument = async (args: any) => {
    const { updateDocument } = await graphClient.client?.request(
      updateDocumentMutation,
      {
        documentId,
        ...args,
      }
    );

    const currentTime = new Date().toISOString();
    setLastSaved(currentTime);

    console.info("updatedDocument", updateDocument);

    refetchDocument(); // TODO: can now be done with documentId
    mutate("browseKey", () => getDocumentsData(token));
  };

  React.useEffect(() => {
    if (debouncedTitle) {
      updateDocument({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  React.useEffect(() => {
    if (debouncedJson) {
      // console.info("debouncedJson", debouncedJson);
      updateDocument({
        content: JSON.stringify(debouncedJson),
        plaintext: editorPlaintext,
      });
    }
  }, [debouncedJson]);

  React.useEffect(() => {
    if (debouncedMessages) {
      // console.info("messages", messages);
      updateDocument({ messages: JSON.stringify(debouncedMessages) });
    }
  }, [debouncedMessages]);

  const onTitleChange = (e: any) => {
    console.info("title change", e.target.value);
    dispatch({ type: "editorTitle", payload: e.target.value });
  };

  return (
    <header>
      <Box display="flex" flexDirection="row" alignItems="center">
        <TextField
          onChange={onTitleChange}
          defaultValue={documentData?.title}
          placeholder="Document Title"
          style={{
            width: "400px",
          }}
        />
        {lastSaved ? (
          <Typography ml={2} variant="body1">
            Autosaved on{" "}
            {DateTime.fromISO(lastSaved).toLocaleString(DateTime.DATETIME_MED)}
          </Typography>
        ) : (
          <></>
        )}
      </Box>
    </header>
  );
};

export default EditorHeader;

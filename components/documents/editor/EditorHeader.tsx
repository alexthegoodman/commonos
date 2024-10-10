import * as React from "react";

import { useDocumentsContext } from "../../../context/DocumentsContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useCookies } from "react-cookie";
import graphClient from "../../../helpers/GQLClient";
import { updateDocumentMutation } from "../../../gql/document";
import useSWR, { mutate } from "swr";
import {
  getDocumentsData,
  getDocumentTemplatesData,
  newDocumentTemplate,
  updateDocumentTemplate,
} from "../../../fetchers/document";
import { Box, Button, TextField, Typography } from "@mui/material";
import { getUserData } from "@/fetchers/user";
const { DateTime } = require("luxon");

const EditorHeader = ({
  documentId = "",
  documentData = null,
  refetchDocument = () => console.info("refetchDocument"),
}) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  graphClient.setupClient(token);

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  const { data: documentTemplates } = useSWR(
    "documentTemplates",
    () => getDocumentTemplatesData(token),
    {
      revalidateOnMount: true,
    }
  );

  const documentTemplateMatch = documentTemplates?.filter(
    (template) => template.sourceId === documentId
  )[0];

  const [
    {
      editorJson,
      editorPlaintext,
      editorTitle,
      markdown,
      messages,
      commonJson,
    },
    dispatch,
  ] = useDocumentsContext();
  const debouncedTitle = useDebounce(editorTitle, 500);
  const debouncedJson = useDebounce(editorJson, 500);
  const debouncedMarkdown = useDebounce(markdown, 2000);
  const debouncedMessages = useDebounce(messages, 500);
  const debouncedCommonJson = useDebounce(commonJson, 500);
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);
  const [hasMounted, setHasMounted] = React.useState(false);

  const updateDocument = async (args: any) => {
    const { updateDocument } = await graphClient?.request(
      updateDocumentMutation,
      {
        documentId,
        ...args,
      }
    );

    const currentTime = new Date().toISOString();
    setLastSaved(currentTime);

    console.info("updatedDocument", updateDocument);

    // refetchDocument(); // TODO: can now be done with documentId
    mutate("browseKey", () => getDocumentsData(token));
  };

  React.useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }
  }, []);

  React.useEffect(() => {
    if (debouncedTitle) {
      updateDocument({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  // React.useEffect(() => {
  //   if (debouncedJson) {
  //     // console.info("debouncedJson", debouncedJson);
  //     updateDocument({
  //       content: JSON.stringify(debouncedJson),
  //       plaintext: editorPlaintext,
  //     });
  //   }
  // }, [debouncedJson]);

  React.useEffect(() => {
    if (hasMounted && debouncedCommonJson) {
      console.info("debouncedCommonJson");
      updateDocument({
        masterJson: JSON.stringify(debouncedCommonJson?.masterJson),
        masterVisuals: JSON.stringify(debouncedCommonJson?.masterVisuals),
      });
    }
  }, [debouncedCommonJson]);

  // React.useEffect(() => {
  //   if (hasMounted && debouncedMessages) {
  //     // console.info("messages", messages);
  //     updateDocument({ messages: JSON.stringify(debouncedMessages) });
  //   }
  // }, [debouncedMessages]);

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
        {userData?.role === "ADMIN" && (
          <Box display="flex" flexDirection="row" alignItems="center" ml={2}>
            <Typography>Admin Tools</Typography>
            {/* <Dropdown
              label={templateCategory ? "" : "Choose category..."}
              options={[
                {
                  label: "Category",
                  value: "123",
                },
              ]}
              handleMenuItemClick={handleSetTemplateCategory}
            /> */}
            {documentTemplateMatch ? (
              <Button
                color="success"
                variant="contained"
                size="small"
                onClick={async () => {
                  await updateDocumentTemplate(
                    token,
                    documentTemplateMatch.id,
                    JSON.stringify(commonJson?.masterVisuals)
                  );
                  mutate("documentTemplates", () =>
                    getDocumentTemplatesData(token)
                  );
                  console.info("updated template");
                }}
              >
                Update Template
              </Button>
            ) : (
              <Button
                color="success"
                variant="contained"
                size="small"
                onClick={async () => {
                  await newDocumentTemplate(
                    token,
                    documentId,
                    documentData?.title,
                    JSON.stringify(commonJson?.masterVisuals)
                  );
                  mutate("documentTemplates", () =>
                    getDocumentTemplatesData(token)
                  );

                  console.info("created template");
                }}
              >
                Save as Template
              </Button>
            )}
          </Box>
        )}
      </Box>
    </header>
  );
};

export default EditorHeader;

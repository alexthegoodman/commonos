import * as React from "react";

import { Box, TextField } from "@mui/material";
const { DateTime } = require("luxon");

const EditorHeader = ({ title, setTitle }) => {
  const onTitleChange = (e: any) => {
    console.info("title change", e.target.value);
    setTitle(e.target.value);
  };

  return (
    <header style={{ marginBottom: "10px" }}>
      <Box>
        <TextField
          onChange={onTitleChange}
          defaultValue={title}
          placeholder="Title"
        />
      </Box>
    </header>
  );
};

export default EditorHeader;

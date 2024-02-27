"use client";

import PostTypeForm from "@/components/content/forms/PostTypeForm";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function AddContact() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values) => {
    setIsLoading(true);
    console.info("onFormSubmit", values);
    // await createContact(token, values);
    setIsLoading(false);
  };

  return (
    <>
      <Box pl={2}>
        <Typography variant="h4">Add Post Type</Typography>
        <PostTypeForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
      </Box>
    </>
  );
}

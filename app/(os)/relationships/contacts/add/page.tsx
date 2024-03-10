"use client";

import ContactForm from "@/components/relationships/forms/ContactForm";
import { createContact } from "@/fetchers/relationship";
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
    await createContact(token, values);
    setIsLoading(false);
  };

  return (
    <>
      <Box>
        <Typography variant="h4">Add Contact</Typography>
        <ContactForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
      </Box>
    </>
  );
}

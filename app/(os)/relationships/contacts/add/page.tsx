"use client";

import ContactForm from "@/components/relationships/forms/ContactForm";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function AddContact() {
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = (data) => {
    setIsLoading(true);
    console.info("submit", data);
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

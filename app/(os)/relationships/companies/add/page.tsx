"use client";

import CompanyForm from "@/components/relationships/forms/CompanyForm";
import { createCompany, createContact } from "@/fetchers/relationship";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function AddCompany() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values) => {
    setIsLoading(true);
    console.info("onFormSubmit", values);
    await createCompany(token, values);
    setIsLoading(false);
  };

  return (
    <>
      <Box>
        <Typography variant="h4">Add Company</Typography>
        <CompanyForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
      </Box>
    </>
  );
}

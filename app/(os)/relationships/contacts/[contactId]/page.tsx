"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import ContactForm from "@/components/relationships/forms/ContactForm";
import {
  createContact,
  getContact,
  updateContact,
} from "@/fetchers/relationship";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Contact(props) {
  const { params } = props;
  const contactId = params.contactId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: contactData,
    error,
    isLoading: contactLoading,
  } = useSWR("contactKey" + contactId, () => getContact(token, contactId), {
    revalidateOnMount: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values) => {
    setIsLoading(true);
    console.info("onFormSubmit", values);
    await updateContact(token, contactId, values);
    setIsLoading(false);
  };

  if (contactLoading) return <PrimaryLoader />;

  return (
    <>
      <Box>
        <Typography variant="h4">Edit Contact</Typography>
        <ContactForm
          initialValues={contactData?.fields}
          onFormSubmit={onFormSubmit}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
}

"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import SettingsForm from "@/components/relationships/forms/SettingsForm";
import {
  getContactSettings,
  putContactSettings,
} from "@/fetchers/relationship";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function Settings() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [formLoading, setFormLoading] = useState(false);

  const {
    data: contactSettingsData,
    error,
    isLoading,
  } = useSWR("contactSettingsKey", () => getContactSettings(token), {
    revalidateOnMount: true,
  });

  const onFormSubmit = async (fields: any) => {
    console.log("onFormSubmit", fields);
    setFormLoading(true);
    await putContactSettings(token, fields);
    mutate("contactSettingsKey", () => getContactSettings(token));
    setFormLoading(false);
  };

  return (
    <>
      <Box px={3}>
        <Typography variant="h4" mb={2}>
          Contacts Settings
        </Typography>
        {isLoading && <PrimaryLoader />}
        {!isLoading && (
          <SettingsForm
            initialFields={contactSettingsData?.fields}
            onFormSubmit={onFormSubmit}
            isLoading={formLoading}
          />
        )}
      </Box>
    </>
  );
}

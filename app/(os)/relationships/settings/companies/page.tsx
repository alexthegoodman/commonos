"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import SettingsForm from "@/components/relationships/forms/SettingsForm";
import {
  getCompanySettings,
  putCompanySettings,
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
    data: companySettingsData,
    error,
    isLoading,
  } = useSWR("companySettingsKey", () => getCompanySettings(token), {
    revalidateOnMount: true,
  });

  const onFormSubmit = async (fields: any) => {
    console.log("onFormSubmit", fields);
    setFormLoading(true);
    await putCompanySettings(token, fields);
    mutate("companySettingsKey", () => getCompanySettings(token));
    setFormLoading(false);
  };

  return (
    <>
      <Box px={3}>
        <Typography variant="h4" mb={2}>
          Companies Settings
        </Typography>
        {isLoading && <PrimaryLoader />}
        {!isLoading && (
          <SettingsForm
            initialFields={companySettingsData?.fields}
            onFormSubmit={onFormSubmit}
            isLoading={formLoading}
          />
        )}
      </Box>
    </>
  );
}

"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import DomainSettingsForm from "@/components/send-email/forms/DomainSettingsForm";
import { myDomainSettings } from "@/fetchers/send-email";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function Settings() {
  return (
    <>
      <Box px={3}>
        <Typography variant="h4" mb={2}>
          Domain Settings
        </Typography>
        <DomainSettingsForm />
      </Box>
    </>
  );
}

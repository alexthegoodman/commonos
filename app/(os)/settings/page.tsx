"use client";

import LogoutButton from "@/components/core/settings/LogoutButton";
import ManageSubscriptionLink from "@/components/core/settings/ManageSubscriptionLink";
import { Box, Typography } from "@mui/material";

export default function Settings() {
  return (
    <>
      <Box>
        <Typography variant="h4">Settings</Typography>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <ManageSubscriptionLink />
          <LogoutButton />
        </Box>
      </Box>
    </>
  );
}

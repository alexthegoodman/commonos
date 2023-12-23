"use client";

import { Box, Button } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import NotificationList from "./NotificationList";
import SystemWeather from "./SystemWeather";
import SystemClock from "./SystemClock";
import ColorModeSwitch from "./ColorModeSwitch";
import UsageIndicator from "./UsageIndicator";
import { Star, Upgrade } from "@mui/icons-material";
import UpgradeButton from "./UpgradeButton";

export default function PrimaryHeader() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      px={1}
    >
      <Box>
        <ProfileMenu />
        <NotificationList />
      </Box>
      <Box display="flex" flexDirection="row">
        <UpgradeButton />
        <ColorModeSwitch />
        <UsageIndicator />
        <SystemWeather />
        <SystemClock />
      </Box>
    </Box>
  );
}

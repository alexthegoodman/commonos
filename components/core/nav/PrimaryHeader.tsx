import { Box } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import NotificationList from "./NotificationList";
import SystemWeather from "./SystemWeather";
import SystemClock from "./SystemClock";

export default function PrimaryHeader() {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Box>
        <ProfileMenu />
        <NotificationList />
      </Box>
      <Box display="flex" flexDirection="row">
        <SystemWeather />
        <SystemClock />
      </Box>
    </Box>
  );
}

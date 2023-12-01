import { Avatar, Box, Typography } from "@mui/material";

export default function ProfileMenu() {
  return (
    <Box display="flex" flexDirection="row">
      <Avatar sx={{ width: 45, height: 45 }} />
      <Typography variant="body2">
        Welcome back, <br />
        Alex Goodman
      </Typography>
    </Box>
  );
}

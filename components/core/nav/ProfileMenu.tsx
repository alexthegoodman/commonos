import { getUserData } from "@/fetchers/user";
import { Avatar, Box, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function ProfileMenu() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      padding="5px 0 0 0"
    >
      {userData?.profileUrl && (
        <Avatar sx={{ width: 45, height: 45 }} src={userData.profileUrl} />
      )}
      <Typography variant="body2">
        Welcome back, <br />
        {userData?.email}
      </Typography>
    </Box>
  );
}

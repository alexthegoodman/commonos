import { getUserData } from "@/fetchers/user";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function UsageIndicator() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  let usageMax = 0;
  if (userData?.subscription === "NONE") {
    usageMax = 50000;
  } else if (userData?.subscription === "STANDARD") {
    usageMax = 2000000;
  }
  const usagePerc = Math.floor((userData?.periodTokenUsage / usageMax) * 100);

  return (
    <Box position="relative" mr={2}>
      <>
        <CircularProgress variant="determinate" value={usagePerc} />
      </>
      <Tooltip title={`${usagePerc}% tokens used`}>
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2">{usagePerc}%</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

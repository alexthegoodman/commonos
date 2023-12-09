import { Box, Link, styled } from "@mui/material";

const CmFooter = styled("footer")(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  bottom: theme.spacing(5),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  boxSizing: "border-box",
}));

export default function LauncherFooter() {
  return (
    <CmFooter>
      <Box>
        <Link href="/flows">Previous Flows</Link>
      </Box>
      {/* <Box>
        <Link href="/apps">See Apps</Link>
      </Box> */}
      <Box>
        <Link href="/settings">Settings</Link>
      </Box>
    </CmFooter>
  );
}

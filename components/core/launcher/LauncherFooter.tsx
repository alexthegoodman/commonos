import { Box, Link, styled } from "@mui/material";

const CmFooter = styled("footer")(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  bottom: 0,
  paddingBottom: theme.spacing(2),
}));

export default function LauncherFooter() {
  return (
    <CmFooter>
      <Box>
        <Link href="/files">Files</Link>
      </Box>
      <Box>
        <Link href="/apps">See Apps</Link>
      </Box>
      <Box>
        <Link href="/settings">Settings</Link>
      </Box>
    </CmFooter>
  );
}

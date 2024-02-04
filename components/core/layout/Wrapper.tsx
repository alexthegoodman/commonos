import { styled } from "@mui/material";

export const Wrapper = styled("main")(({ theme }) => ({
  boxSizing: "border-box",
  width: "100%",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("md")]: {
    padding: "0 10px",
  },
}));

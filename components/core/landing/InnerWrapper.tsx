import { Box, styled } from "@mui/material";

export const InnerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    padding: "0 10px",
  },
}));

export const BlockImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "block",
  borderRadius: "25px",
  // boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
  border: "1px rgba(0, 0, 0, 0.12) solid",
}));

export const BlockContent = styled(Box)(({ theme }) => ({
  paddingRight: "150px",
  "& h4": {
    fontSize: "28px",
  },
  "& p": {
    fontSize: "22px",
  },
  [theme.breakpoints.down("md")]: {
    paddingRight: "0",
  },
}));

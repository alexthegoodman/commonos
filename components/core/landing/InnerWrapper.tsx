import { Box, styled } from "@mui/material";

export const InnerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
}));

export const BlockImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "block",
}));

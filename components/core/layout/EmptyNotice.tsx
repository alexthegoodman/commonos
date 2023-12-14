import { Alert, Box, Typography, styled } from "@mui/material";
import * as React from "react";

const CenterBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const EmptyNotice = ({
  icon = "ph-info-thin",
  message = "Nothing here yet!",
}) => {
  return (
    <CenterBox>
      <Alert severity="info">
        <Typography variant="body1">{message}</Typography>
      </Alert>
    </CenterBox>
  );
};

export default EmptyNotice;

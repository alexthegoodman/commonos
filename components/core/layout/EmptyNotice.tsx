import { Box, Typography } from "@mui/material";
import * as React from "react";

const EmptyNotice = ({
  icon = "ph-info-thin",
  message = "Nothing here yet!",
}) => {
  return (
    <section>
      <Box>
        <i className={icon}></i>
        <Typography variant="body1">{message}</Typography>
      </Box>
    </section>
  );
};

export default EmptyNotice;

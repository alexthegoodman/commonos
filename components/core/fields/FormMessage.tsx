import { Alert } from "@mui/material";
import * as React from "react";

const FormMessage = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click FormMessage"),
  type = "",
  message = "",
}) => {
  const clickHandler = (e: MouseEvent) => onClick(e);
  return (
    <>{message !== "" ? <Alert severity={type}>{message}</Alert> : <></>}</>
  );
};

export default FormMessage;

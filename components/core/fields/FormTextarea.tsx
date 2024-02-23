import { Box, TextareaAutosize, Typography, styled } from "@mui/material";
import * as React from "react";

const CmTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1),
  border: "1px solid #ccc",
  borderRadius: "0px",
  outline: "none",
  resize: "none",
  "&:focus": {
    border: "1px solid #aaa",
  },
}));

const FormTextarea = ({
  validation = {},
  errors = null,
  register = null,
  ...fieldProps
}) => {
  return (
    <Box
      width="100%"
      sx={{
        "& textarea": {
          boxShadow: "0px 6px 12px 1px rgba(0, 0, 0, 0.2)",
          borderRadius: "25px",
          padding: "30px",
        },
      }}
    >
      <CmTextarea {...fieldProps} {...register(fieldProps.name, validation)} />
      {errors !== null && errors[fieldProps.name] ? (
        <Typography variant="body2" color="red">
          {fieldProps.name} is required.
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default FormTextarea;

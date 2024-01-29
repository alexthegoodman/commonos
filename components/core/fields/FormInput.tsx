import * as React from "react";

import SimpleErrorMessage from "./SimpleErrorMessage";
import { Box, TextField } from "@mui/material";

const FormInput = ({
  //   name = "",
  //   type = "text",
  validation = {},
  errors = null,
  register = null,
  ...fieldProps
}) => {
  return (
    <Box>
      <TextField
        {...register(fieldProps.name, validation)}
        {...fieldProps}
        error={errors !== null && errors[fieldProps.name] ? true : false}
        helperText={
          errors !== null && errors[fieldProps.name]
            ? errors[fieldProps.name].message
            : ""
        }
      />
    </Box>
  );
};

export default FormInput;

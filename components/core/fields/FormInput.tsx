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
        {...fieldProps}
        {...register(fieldProps.name, validation)}
        error={errors !== null && errors[fieldProps.name] ? true : false}
        helperText={
          errors !== null && errors[fieldProps.name]
            ? errors[fieldProps.name].message
            : ""
        }
      />
      {/* <input {...fieldProps} {...register(fieldProps.name, validation)} /> */}
      {/* <SimpleErrorMessage errors={errors} fieldProps={fieldProps} /> */}
    </Box>
  );
};

export default FormInput;

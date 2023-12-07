import * as React from "react";

import SimpleErrorMessage from "./SimpleErrorMessage";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const FormSelect = ({
  //   name = "",
  //   type = "text",
  label = "",
  options = [],
  validation = {},
  errors = null,
  register = null,
  ...fieldProps
}) => {
  return (
    <Box>
      {/* <TextField
        {...fieldProps}
        {...register(fieldProps.name, validation)}
        error={errors !== null && errors[fieldProps.name] ? true : false}
        helperText={
          errors !== null && errors[fieldProps.name]
            ? errors[fieldProps.name].message
            : ""
        }
      /> */}
      <FormControl fullWidth>
        {label && <InputLabel id={fieldProps.name}>{label}</InputLabel>}
        <Select
          labelId={fieldProps.name}
          label={label}
          {...fieldProps}
          {...register(fieldProps.name, validation)}
          error={errors !== null && errors[fieldProps.name] ? true : false}
        >
          {options?.map((option, i) => (
            <MenuItem
              key={`menuItem` + fieldProps.name + i}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormSelect;

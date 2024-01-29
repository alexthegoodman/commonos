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
      <FormControl fullWidth>
        {label && (
          <InputLabel id={fieldProps.name} style={{ color: "black" }}>
            {label}
          </InputLabel>
        )}
        <Select
          labelId={fieldProps.name}
          label={label}
          {...register(fieldProps.name, validation)}
          {...fieldProps}
          error={errors !== null && errors[fieldProps.name] ? true : false}
          // value="text"
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

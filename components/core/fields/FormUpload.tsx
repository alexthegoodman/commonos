import * as React from "react";
import { useFormContext } from "react-hook-form";
import SimpleErrorMessage from "./SimpleErrorMessage";
import { Button, styled } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FormUpload = ({
  validation = {},
  errors = null,
  register = null,
  onFinishFile = (file, base64) => console.info("finished file"),
  ...fieldProps
}) => {
  // NOTE: requires <FormProvider />
  const { register: contextRegister, setValue, getValues } = useFormContext();
  const { name } = fieldProps;

  // const currentValues = getValues();

  const fileNameField = name + "Name";
  const fileSizeField = name + "Size";
  const fileTypeField = name + "Type";
  const fileDataField = name + "Data";

  React.useEffect(() => {
    contextRegister(fileSizeField);
    contextRegister(fileTypeField);
    contextRegister(fileDataField);
  }, [name]);

  const onFileInputChange = (e) => {
    const file = e.target["files"][0];
    const reader = new FileReader();

    setValue(fileNameField, file.name);
    setValue(fileSizeField, file.size);
    setValue(fileTypeField, file.type);

    reader.onload = function (item) {
      const base64 = item?.target?.result as string;
      setValue(fileDataField, base64);

      console.info("reader.onload form values", getValues());

      onFinishFile(file, base64);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="formUpload">
      {/* {fieldProps.placeholder !== "" ? (
        <label>{fieldProps.placeholder}</label>
      ) : (
        <></>
      )} */}
      {/* <input
        type="file"
        {...fieldProps}
        {...register(fieldProps.name, validation)}
        onChange={onFileInputChange}
      /> */}
      <Button
        component="label"
        variant="contained"
        color="success"
        startIcon={<CloudUpload />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          {...fieldProps}
          {...register(fieldProps.name, validation)}
          onChange={onFileInputChange}
        />
      </Button>
      <SimpleErrorMessage errors={errors} fieldProps={fieldProps} />
    </div>
  );
};

export default FormUpload;

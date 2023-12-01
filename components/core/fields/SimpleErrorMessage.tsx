import { ErrorMessage } from "@hookform/error-message";
import * as React from "react";

const SimpleErrorMessage = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click SimpleErrorMessage"),
  errors = null,
  fieldProps = null,
}) => {
  const clickHandler = (e: MouseEvent) => onClick(e);
  return (
    <>
      {errors !== null && errors[fieldProps.name] ? (
        <ErrorMessage
          errors={errors}
          name={fieldProps.name}
          render={({ message }) => (
            <span className="formInputWarning">{message}</span>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default SimpleErrorMessage;

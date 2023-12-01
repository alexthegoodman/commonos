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
    <>
      {message !== "" ? (
        <section className={`formMessage ${type}`}>
          <div className="formMessageInner">
            <span className="messageContent">{message}</span>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default FormMessage;

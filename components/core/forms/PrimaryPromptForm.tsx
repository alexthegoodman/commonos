"use client";

import request from "graphql-request";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

import FormInput from "../fields/FormInput";
import FormMessage from "../fields/FormMessage";

import Helpers from "../../../helpers/Helpers";
import { Alert, Box, Button, Typography, styled } from "@mui/material";
import FormTextarea from "../fields/FormTextarea";
import { newFlow } from "@/fetchers/flow";

// import { useTranslation } from "next-i18next";
// import MixpanelBrowser from "../../../helpers/MixpanelBrowser";

const CmForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "25px",
}));

const PrimaryPromptForm = ({
  onClick = (e) => console.info("Click AuthForm"),
  type = "login",
}) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  // const { t } = useTranslation();
  const helpers = new Helpers();
  // const mixpanel = new MixpanelBrowser();

  const router = useRouter();

  const [formErrorMessage, setFormErrorMessage] = React.useState("");
  const [submitLoading, setSubmitLoading] = React.useState(false);

  console.info("cookies", cookies);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("onSubmit", data);

    setSubmitLoading(true);

    try {
      // prompt power
      const { id } = await newFlow(token, data.prompt, "edit");
      router.push(`/flows/${id}`);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.errors[0].message;
      setFormErrorMessage(errorMessage);
      setSubmitLoading(false);
    }
  };

  const onError = (error: any) => console.error(error);

  let submitButtonText = "Begin Flow";

  if (submitLoading) submitButtonText = "Working...";

  return (
    <Box>
      <Alert severity="info">
        <Typography variant="body1">
          The magic of CommonOS is in the Flow experience.
          <br />
          Try it with a prompt!
        </Typography>
      </Alert>
      <CmForm onSubmit={handleSubmit(onSubmit, onError)}>
        <FormMessage type="error" message={formErrorMessage} />

        <FormTextarea
          type="prompt"
          name="prompt"
          placeholder={"What do you want to do?"}
          register={register}
          errors={errors}
          validation={{
            required: "Prompt Required",
          }}
        />

        <Button type="submit" disabled={submitLoading}>
          {submitButtonText}
        </Button>
      </CmForm>
    </Box>
  );
};

export default PrimaryPromptForm;

"use client";

import request from "graphql-request";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
const { DateTime } = require("luxon");
// import LogRocket from "logrocket";

import { authenticateQuery } from "../../../gql/user";
import { registerMutation } from "../../../gql/user";
import FormInput from "../fields/FormInput";
import FormMessage from "../fields/FormMessage";

// import Utilities from "commonplace-utilities/lib";
import { fullDomain, graphqlUrl } from "../../../helpers/urls";
import Helpers from "../../../helpers/Helpers";
import { CookieSettings } from "../../../helpers/CookieSettings";

import { Box, Button, Link, Typography } from "@mui/material";

// import { useTranslation } from "next-i18next";
// import MixpanelBrowser from "../../../helpers/MixpanelBrowser";

const AuthForm = ({
  onClick = (e) => console.info("Click AuthForm"),
  type = "login",
  buttonText = null,
  showLinks = true,
}) => {
  // const { t } = useTranslation();
  const helpers = new Helpers();
  // const mixpanel = new MixpanelBrowser();

  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["cmUserToken"]);
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
      var userIdData, token;

      const authorizationHeader = helpers.createAuthHeader(
        `${data.email}:${data.password}`
      );

      if (type === "login") {
        // mixpanel.track("Sign In - Attempt", { email: data.email });

        userIdData = (await request(
          graphqlUrl,
          authenticateQuery,
          {},
          {
            Authorization: authorizationHeader,
          }
        )) as any;

        token = userIdData.authenticate;
      } else if (type === "sign-up") {
        // mixpanel.track("Sign Up - Attempt", { email: data.email });

        userIdData = (await request(
          graphqlUrl,
          registerMutation,
          {},
          {
            Authorization: authorizationHeader,
          }
        )) as any;

        token = userIdData.registerUser;

        // const ReactPixel = require("react-facebook-pixel");
        // ReactPixel.default.trackCustom("SignUp", {});
        import("react-facebook-pixel")
          .then((x) => x.default)
          .then((ReactPixel) => {
            ReactPixel.trackCustom("SignUp", {});
          });
      }

      const expireCookie = DateTime.now()
        .plus({ weeks: 1 })
        .endOf("day")
        .toUTC()
        .toJSDate();

      console.info(
        "token",
        token,
        fullDomain,
        expireCookie,
        process.env.NODE_ENV,
        process.env.NEXT_PUBLIC_APP_ENV
      );

      setCookie("cmUserToken", token, {
        ...CookieSettings,
        expires: expireCookie,
      });

      console.info("cookie set with token");

      // try {
      //   LogRocket.identify(data.email);
      // } catch (error) {
      //   console.error("LogRocket error", error);
      // }

      console.info("redirect to launcher");

      // cleanup and
      setFormErrorMessage("");

      if (type === "login") {
        router.push("/launcher");
      } else if (type === "sign-up") {
        router.push("/welcome");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.errors[0].message;
      setFormErrorMessage(errorMessage);
      setSubmitLoading(false);
    }
  };

  const onError = (error: any) => console.error(error);

  const headline = type === "login" ? "Login" : "Sign Up";
  let submitButtonText = type === "login" ? "Login" : "Sign Up";

  if (buttonText) submitButtonText = buttonText;

  if (submitLoading) submitButtonText = "Loading...";

  return (
    <Box pt={4}>
      <Typography variant="h4" mb={2}>
        {headline}
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "10px",
        }}
      >
        <FormMessage type="error" message={formErrorMessage} />

        <FormInput
          type="email"
          name="email"
          placeholder={"Email"}
          register={register}
          errors={errors}
          validation={{
            required: "Email Required",
          }}
          sx={{ minWidth: { md: "350px" }, width: "100%" }}
        />

        <FormInput
          type="password"
          name="password"
          placeholder={"Password"}
          register={register}
          errors={errors}
          validation={{
            required: "Password Required",
          }}
          sx={{ minWidth: { md: "350px" }, width: "100%" }}
        />

        <Button
          type="submit"
          color="success"
          variant="contained"
          disabled={submitLoading}
        >
          {submitButtonText}
        </Button>
      </form>
      {showLinks && (
        <div>
          {type === "login" ? (
            <Typography variant="body1">
              Or you may <Link href="/sign-up">Sign Up</Link> instead
            </Typography>
          ) : (
            <Typography variant="body1">
              Or you may <Link href="/login">Login</Link> instead
            </Typography>
          )}
        </div>
      )}
    </Box>
  );
};

export default AuthForm;

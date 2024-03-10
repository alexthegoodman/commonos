"use client";

import FormInput from "@/components/core/fields/FormInput";
import FormMessage from "@/components/core/fields/FormMessage";
import FormSelect from "@/components/core/fields/FormSelect";
import EmptyNotice from "@/components/core/layout/EmptyNotice";
import { myDomainSettings, putDomainSettings } from "@/fetchers/send-email";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

const MiniTable = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
  "& th, td": {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  "& th, & tr": {
    backgroundColor: "#f2f2f2",
  },
});

export default function DomainSettingsForm() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();

  const [formErrorMessage, setFormErrorMessage] = useState("");
  // const [fields, setFields] = useState(initialFields);

  const [formLoading, setFormLoading] = useState(false);

  const {
    data: domainSettingsData,
    error,
    isLoading,
  } = useSWR("domainSettingsKey", () => myDomainSettings(token), {
    revalidateOnMount: true,
  });

  const domainName = domainSettingsData?.domainName;
  const dkimData = domainSettingsData?.dkimData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFormSubmit = async (fields: any) => {
    console.log("onFormSubmit", fields);
    setFormLoading(true);
    await putDomainSettings(token, fields.domainName);
    mutate("domainSettingsKey", () => myDomainSettings(token));
    setFormLoading(false);
  };

  const onSubmit = async (data: any) => {
    console.info("data", data);
    onFormSubmit(data);
  };

  const onError = (error: any) => console.error(error);

  console.info("dkimdata", dkimData);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
          maxWidth: "450px",
        }}
      >
        <FormMessage type="error" message={formErrorMessage} />

        <Box>
          <FormInput
            placeholder="Domain Name (ex. commonos.cloud)"
            type="text"
            name="domainName"
            defaultValue={domainName}
            disabled={domainName}
            register={register}
            errors={errors}
            validation={{
              required: true,
              pattern:
                /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i,
            }}
            fullWidth
          />
        </Box>
        {!domainName && (
          <Button
            variant="contained"
            color="success"
            type="submit"
            style={{ marginTop: "5px" }}
            disabled={isLoading}
          >
            Save Domain
          </Button>
        )}
      </form>
      {dkimData && (
        <>
          <Typography variant="h6" mb={2}>
            DKIM Settings
          </Typography>
          <Typography variant="body2" mb={2}>
            Add the following DNS records to your domain to verify it with
            CommonOS.
          </Typography>
          <MiniTable>
            <thead>
              <tr>
                <th>Host</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {dkimData.map((token: string) => {
                return (
                  <tr key={token}>
                    <td>
                      {token}._domainkey.{domainName}
                    </td>
                    <td>{token}.dkim.amazonses.com</td>
                  </tr>
                );
              })}
            </tbody>
          </MiniTable>
        </>
      )}
    </>
  );
}

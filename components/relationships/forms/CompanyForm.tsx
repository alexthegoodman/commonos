"use client";

import FormInput from "@/components/core/fields/FormInput";
import FormMessage from "@/components/core/fields/FormMessage";
import FormSelect from "@/components/core/fields/FormSelect";
import EmptyNotice from "@/components/core/layout/EmptyNotice";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { getCompanySettings } from "@/fetchers/relationship";
import { Box, Button, Link, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

// const defaultFields = [
//   {
//     id: uuidv4(),
//     name: "Full Name",
//     type: "text",
//   },
// ];

export default function CompanyForm({
  initialValues = [],
  onFormSubmit = (data) => console.info("submit"),
  isLoading = false,
  isUpdate = false,
}) {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formInfoMessage, setFormInfoMessage] = useState("");

  const {
    data: companySettingsData,
    error,
    isLoading: companySettingsLoading,
  } = useSWR("companySettingsKey", () => getCompanySettings(token), {
    revalidateOnMount: true,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = async (data: any) => {
    onFormSubmit(data);
    reset();
    setFormInfoMessage("Saved successfully!");
  };

  const onError = (error: any) => console.error(error);

  if (companySettingsLoading) return <PrimaryLoader />;

  return (
    <>
      <Typography variant="body1" mb={2}>
        Add custom fields to your companies{" "}
        <Link href="/relationships/settings/companies">here</Link>.
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
          maxWidth: "400px",
        }}
      >
        <FormMessage type="info" message={formInfoMessage} />
        <FormMessage type="error" message={formErrorMessage} />

        <FormInput
          type="text"
          name="name"
          placeholder="Company Name"
          register={register}
          errors={errors}
          fullWidth
        />

        {companySettingsData?.fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <FormInput
                  key={field.id}
                  type="text"
                  name={field.id}
                  placeholder={field.name}
                  register={register}
                  errors={errors}
                  fullWidth
                />
              );
          }
        })}

        <Button
          variant="contained"
          color="success"
          type="submit"
          style={{ marginTop: "5px" }}
          disabled={isLoading}
        >
          {isUpdate ? "Update Company" : "Save Company"}
        </Button>
      </form>
    </>
  );
}

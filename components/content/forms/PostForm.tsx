"use client";

import FormInput from "@/components/core/fields/FormInput";
import FormMessage from "@/components/core/fields/FormMessage";
import FormSelect from "@/components/core/fields/FormSelect";
import EmptyNotice from "@/components/core/layout/EmptyNotice";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { getContactSettings } from "@/fetchers/relationship";
import { Box, Button, Link, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import ComposePost from "../editor/ComposePost";

// const defaultFields = [
//   {
//     id: uuidv4(),
//     name: "Full Name",
//     type: "text",
//   },
// ];

export default function PostForm({
  postTypeData = null,
  initialMarkdown = "",
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
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [clearEffect, setClearEffect] = useState(0);

  //   const {
  //     data: contactSettingsData,
  //     error,
  //     isLoading: contactSettingsLoading,
  //   } = useSWR("contactSettingsKey", () => getContactSettings(token), {
  //     revalidateOnMount: true,
  //   });

  //   const allFields = !contactSettingsLoading
  //     ? [...defaultFields, ...contactSettingsData?.fields]
  //     : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = async (data: any) => {
    onFormSubmit({ ...data, markdown });
    reset();
    setClearEffect(Date.now());
    setFormInfoMessage("Saved successfully!");
  };

  const onError = (error: any) => console.error(error);

  //   if (contactSettingsLoading) return <PrimaryLoader />;

  return (
    <>
      {/* <Typography variant="body1" mb={2}>
        Add custom fields to your contacts{" "}
        <Link href="/relationships/settings/contacts">here</Link>.
      </Typography> */}
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "10px",
          maxWidth: "900px",
        }}
      >
        <FormMessage type="info" message={formInfoMessage} />
        <FormMessage type="error" message={formErrorMessage} />

        <FormInput
          type="text"
          name="title"
          placeholder="Title"
          register={register}
          errors={errors}
          fullWidth
        />

        <ComposePost
          initialMarkdown={initialMarkdown || ""}
          handleChange={(mkd) => {
            setMarkdown(mkd);
          }}
          clearEffect={clearEffect}
        />

        {postTypeData?.fields.map((field) => {
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
          {isUpdate ? "Update Post" : "Save Post"}
        </Button>
      </form>
    </>
  );
}

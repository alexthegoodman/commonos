"use client";

import FormInput from "@/components/core/fields/FormInput";
import FormMessage from "@/components/core/fields/FormMessage";
import FormSelect from "@/components/core/fields/FormSelect";
import EmptyNotice from "@/components/core/layout/EmptyNotice";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export default function SettingsForm({
  initialFields = [],
  onFormSubmit = (data) => console.info("submit"),
  isLoading = false,
}) {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["cmUserToken"]);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [fields, setFields] = useState(initialFields);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    // console.info("data", data, fields);
    onFormSubmit(fields);
  };

  const onError = (error: any) => console.error(error);

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
          <>
            {fields.length < 1 && (
              <EmptyNotice message="Add custom fields here" />
            )}
            {fields.length >= 1 &&
              fields.map((field) => {
                return (
                  <Box
                    key={`field-${field.id}`}
                    display="flex"
                    flexDirection="row"
                    mb={1}
                  >
                    <FormInput
                      type="text"
                      name={`name-${field.id}`}
                      placeholder={"Name"}
                      register={register}
                      errors={errors}
                      validation={{
                        required: "Password Required",
                      }}
                      defaultValue={field.name}
                      onChange={(e) => {
                        console.info("e", e);
                        const newFields = fields.map((f) => {
                          if (f.id === field.id) {
                            return {
                              ...f,
                              name: e.target.value,
                            };
                          } else {
                            return f;
                          }
                        });
                        setFields(newFields);
                      }}
                    />
                    <FormSelect
                      name={`type-${field.id}`}
                      placeholder="Select type"
                      options={[
                        {
                          label: "Text",
                          value: "text",
                        },
                      ]}
                      register={register}
                      errors={errors}
                      validation={{ required: true }}
                      defaultValue={field.type}
                      style={{ minWidth: "125px" }}
                      onChange={(e) => {
                        console.info("e", e);
                        const newFields = fields.map((f) => {
                          if (f.id === field.id) {
                            return {
                              ...f,
                              type: e.target.value,
                            };
                          } else {
                            return f;
                          }
                        });
                        setFields(newFields);
                      }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setFields(fields.filter((f) => f.id !== field.id));
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                );
              })}
          </>

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setFields([...fields, { id: uuidv4(), name: "", type: "text" }]);
            }}
          >
            Add Custom Field
          </Button>
        </Box>
        <Button
          variant="contained"
          color="success"
          type="submit"
          style={{ marginTop: "5px" }}
          disabled={isLoading}
        >
          Save Settings
        </Button>
      </form>
    </>
  );
}

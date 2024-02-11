"use client";

import FormSelect from "@/components/core/fields/FormSelect";
import { useRelationshipsDashboardsContext } from "@/context/RelationshipsDashboardsContext";
import {
  getCompanySettings,
  getContactSettings,
} from "@/fetchers/relationship";
import { Box, Button, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import useSWR from "swr";

export default function CreateVisual() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useRelationshipsDashboardsContext();

  const { data: companySettingsData } = useSWR(
    "companySettingsKey",
    () => getCompanySettings(token),
    {
      revalidateOnMount: true,
    }
  );

  const { data: contactSettingsData } = useSWR(
    "contactSettingsKey",
    () => getContactSettings(token),
    {
      revalidateOnMount: true,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const itemValue = watch("item");
  const fieldValue = watch("field");

  const onSubmit = (data) => {
    console.log(data);

    dispatch({
      type: "visuals",
      payload: state.visuals.concat({
        item: data.item,
        field: data.field,
        type: data.type,
      }),
    });

    reset();
  };

  const onError = (error) => console.error(error);

  return (
    <Box>
      <form
        className="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <FormSelect
          name="item"
          placeholder="Select an item type"
          label="Select an item type"
          options={[
            {
              label: "Contacts",
              value: "contacts",
            },
            {
              label: "Companies",
              value: "companies",
            },
          ]}
          register={register}
          errors={errors}
          validation={{ required: true }}
          style={{
            minWidth: "150px",
          }}
        />
        <FormSelect
          name="field"
          placeholder="Select a field"
          label="Select a field"
          options={
            itemValue === "contacts"
              ? contactSettingsData?.fields?.map((field, i) => {
                  return {
                    label: field.name,
                    value: field.id,
                  };
                })
              : companySettingsData?.fields?.map((field, i) => {
                  return {
                    label: field.name,
                    value: field.id,
                  };
                })
          }
          register={register}
          errors={errors}
          validation={{ required: true }}
          style={{
            minWidth: "150px",
          }}
          disabled={!itemValue}
        />
        <FormSelect
          name="type"
          placeholder="Select a visual type"
          label="Select a visual type"
          options={[
            {
              label: "Bar",
              value: "bar",
            },
            {
              label: "Pie",
              value: "pie",
            },
            //   {
            //     label: "Line",
            //     value: "line",
            //   },
          ]}
          register={register}
          errors={errors}
          validation={{ required: true }}
          style={{
            minWidth: "150px",
          }}
          disabled={!fieldValue}
        />
        <Button type="submit" variant="contained" color="success">
          Add Visual
        </Button>
      </form>
    </Box>
  );
}

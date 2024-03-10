"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import CompanyForm from "@/components/relationships/forms/CompanyForm";
import { getCompany, updateCompany } from "@/fetchers/relationship";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Company(props) {
  const { params } = props;
  const companyId = params.companyId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: companyData,
    error,
    isLoading: companyLoading,
  } = useSWR("companyKey" + companyId, () => getCompany(token, companyId), {
    revalidateOnMount: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values) => {
    setIsLoading(true);
    console.info("onFormSubmit", values);
    await updateCompany(token, companyId, values);
    setIsLoading(false);
  };

  if (companyLoading) return <PrimaryLoader />;

  return (
    <>
      <Box>
        <Typography variant="h4">Edit Company</Typography>
        <CompanyForm
          initialValues={companyData?.fields}
          onFormSubmit={onFormSubmit}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
}

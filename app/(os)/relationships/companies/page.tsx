"use client";

import EnhancedTable from "@/components/relationships/main/EnhancedTable";
import {
  deleteCompany,
  getCompanySettings,
  getMyCompanies,
} from "@/fetchers/relationship";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function Companies() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;
  const rowsPerPage = 15;
  const [page, setPage] = useState(0);

  const { data: companySettingsData } = useSWR(
    "companySettingsKey",
    () => getCompanySettings(token),
    {
      revalidateOnMount: true,
    }
  );

  const {
    data: companiesData,
    error,
    isLoading,
  } = useSWR(
    "companiesKey" + page,
    () => getMyCompanies(token, rowsPerPage, page),
    {
      revalidateOnMount: true,
    }
  );

  const handleRowDelete = async (id: string) => {
    console.log("delete", id);
    await deleteCompany(token, id);
    mutate("companiesKey" + page, () =>
      getMyCompanies(token, rowsPerPage, page)
    );
  };

  return (
    <>
      <Box>
        <EnhancedTable
          slug="companies"
          title="Companies"
          rightToolbar={
            <Box minWidth="150px">
              <Button
                href="/relationships/companies/add/"
                variant="contained"
                color="success"
                fullWidth
              >
                Add Company
              </Button>
            </Box>
          }
          total={companiesData?.count}
          rows={companiesData?.rows}
          settings={companySettingsData}
          onDelete={handleRowDelete}
        />
      </Box>
    </>
  );
}

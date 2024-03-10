"use client";

import EnhancedTable from "@/components/relationships/main/EnhancedTable";
import {
  deleteContact,
  getContactSettings,
  getMyContacts,
} from "@/fetchers/relationship";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function Contacts() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;
  const rowsPerPage = 15;
  const [page, setPage] = useState(0);

  const { data: contactSettingsData } = useSWR(
    "contactSettingsKey",
    () => getContactSettings(token),
    {
      revalidateOnMount: true,
    }
  );

  const {
    data: contactsData,
    error,
    isLoading,
  } = useSWR(
    "contactsKey" + page,
    () => getMyContacts(token, rowsPerPage, page),
    {
      revalidateOnMount: true,
    }
  );

  const handleRowDelete = async (id: string) => {
    console.log("delete", id);
    await deleteContact(token, id);
    mutate("contactsKey" + page, () => getMyContacts(token, rowsPerPage, page));
  };

  return (
    <>
      <Box>
        <EnhancedTable
          slug="contacts"
          title="Contacts"
          rightToolbar={
            <Box minWidth="150px">
              <Button
                href="/relationships/contacts/add/"
                variant="contained"
                color="success"
                fullWidth
              >
                Add Contact
              </Button>
            </Box>
          }
          total={contactsData?.count}
          rows={contactsData?.rows}
          settings={contactSettingsData}
          onDelete={handleRowDelete}
        />
      </Box>
    </>
  );
}

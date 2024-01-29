"use client";

import EnhancedTable from "@/components/relationships/main/EnhancedTable";
import { Box, Button, Typography } from "@mui/material";

export default function Contacts() {
  return (
    <>
      <Box>
        <EnhancedTable
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
        />
      </Box>
    </>
  );
}

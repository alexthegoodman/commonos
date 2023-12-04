"use client";

import { getSheetsData, newSheet } from "@/fetchers/sheet";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Sheets(props) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();

  const {
    data: sheetsData,
    error,
    isLoading,
  } = useSWR("sheetsKey", () => getSheetsData(token), {
    revalidateOnMount: true,
  });

  const addSheet = async () => {
    const { id } = await newSheet(token);

    router.push(`/sheets/${id}`);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addSheet}>Add Sheet</Button>
      </Grid>
      {!isLoading ? (
        sheetsData?.map((sheet) => (
          <Grid item xs={12} md={2} key={sheet.id}>
            <Button
              onClick={() => {
                router.push(`/sheets/${sheet.id}`);
              }}
            >
              {sheet.title}
            </Button>
          </Grid>
        ))
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}

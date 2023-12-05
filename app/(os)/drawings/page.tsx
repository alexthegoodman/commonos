"use client";

import { getDrawingsData, newDrawing } from "@/fetchers/drawing";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Drawings() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();

  const {
    data: drawingsData,
    error,
    isLoading,
  } = useSWR("drawingsKey", () => getDrawingsData(token), {
    revalidateOnMount: true,
  });

  const addDrawing = async () => {
    const { id } = await newDrawing(token);

    router.push(`/drawings/${id}`);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addDrawing}>Add Drawing</Button>
      </Grid>
      {!isLoading ? (
        drawingsData?.map((drawing) => (
          <Grid item xs={12} md={2} key={drawing.id}>
            <Button
              onClick={() => {
                router.push(`/drawings/${drawing.id}`);
              }}
            >
              {drawing.title}
            </Button>
          </Grid>
        ))
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}

"use client";

import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Sheets() {
  const router = useRouter();

  const addSheet = async () => {
    router.push("/sheets/123");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addSheet}>Add Sheet</Button>
      </Grid>
    </Grid>
  );
}

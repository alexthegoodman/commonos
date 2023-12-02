"use client";

import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Videos() {
  const router = useRouter();

  const addFile = async () => {
    router.push("/videos/123");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addFile}>Add File</Button>
      </Grid>
    </Grid>
  );
}

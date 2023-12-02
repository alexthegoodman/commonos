"use client";

import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Slides() {
  const router = useRouter();

  const addPresentation = async () => {
    router.push("/slides/123");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addPresentation}>Add Presentation</Button>
      </Grid>
    </Grid>
  );
}

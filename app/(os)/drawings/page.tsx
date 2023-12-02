"use client";

import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Drawings() {
  const router = useRouter();

  const addDrawing = async () => {
    router.push("/drawings/123");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addDrawing}>Add Drawing</Button>
      </Grid>
    </Grid>
  );
}

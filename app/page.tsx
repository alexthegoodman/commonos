"use client";

import { Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Typography>Welcome</Typography>
      <Link href="/launcher">Enter CommonOS</Link>
    </main>
  );
}

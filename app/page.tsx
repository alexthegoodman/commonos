"use client";

import PrimaryHeader from "@/components/core/nav/PrimaryHeader";
import PrimaryTabs from "@/components/core/nav/PrimaryTabs";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <main>
      <PrimaryHeader />
      <PrimaryTabs />
      <Button>Begin</Button>
    </main>
  );
}

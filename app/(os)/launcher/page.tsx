"use client";

import PrimaryPromptForm from "@/components/core/forms/PrimaryPromptForm";
import AppGrid from "@/components/core/launcher/AppGrid";
import LauncherFooter from "@/components/core/launcher/LauncherFooter";
import { Typography } from "@mui/material";
import Link from "next/link";

export default function Launcher() {
  return (
    <section>
      <PrimaryPromptForm />
      <LauncherFooter />
      {/* <AppGrid /> */}
    </section>
  );
}

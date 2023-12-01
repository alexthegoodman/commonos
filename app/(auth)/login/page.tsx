"use client";

import AuthForm from "@/components/core/forms/AuthForm";
import { Wrapper } from "@/components/core/layout/Wrapper";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Login() {
  return <AuthForm type="login" />;
}

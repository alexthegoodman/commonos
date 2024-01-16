"use client";

import { InnerWrapper } from "@/components/core/landing/InnerWrapper";
import { Box, Typography, styled } from "@mui/material";

const Wrapper = styled(InnerWrapper)(({ theme }) => ({
  padding: "25px 0",
}));

export default function Founders() {
  return <Wrapper>Founders Landing Page</Wrapper>;
}

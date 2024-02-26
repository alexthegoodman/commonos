"use client";

import { createInbox, myInboxes } from "@/fetchers/work-email";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import FormInput from "../../core/fields/FormInput";
import { useState } from "react";
import { myDomainSettings } from "@/fetchers/send-email";
import { myPostTypes } from "@/fetchers/content";

export default function PostTypeList() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const pathname = usePathname();
  const thirdSlug = pathname.split("/")[3];

  const {
    data: postTypesData,
    error,
    isLoading,
  } = useSWR("postTypesKey", () => myPostTypes(token), {
    revalidateOnMount: true,
  });

  console.info("postTypesData", postTypesData);

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" mb={2}>
        Your Post Types
      </Typography>
      {postTypesData &&
        postTypesData.map((postType) => (
          <Button
            key={postType.id}
            onClick={() => router.push(`/content/post-types/${postType.id}`)}
            sx={{
              marginBottom: 1,
              backgroundColor:
                thirdSlug === postType.id ? "#515151" : "transparent",
              color: thirdSlug === postType.id ? "#FFF" : "#515151",
            }}
          >
            {postType.name}
          </Button>
        ))}
      <Button
        variant="contained"
        color="success"
        href="/content/post-types/new-post-type"
      >
        Create Post Type
      </Button>
    </Box>
  );
}

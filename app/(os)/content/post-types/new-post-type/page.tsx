"use client";

import PostTypeForm from "@/components/content/forms/PostTypeForm";
import { createPostType, myPostTypes } from "@/fetchers/content";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";

export default function AddContact() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data, values) => {
    setIsLoading(true);
    console.info("onFormSubmit", data, values);
    const newPostType = await createPostType(token, data.name, values);
    mutate("postTypesKey", () => myPostTypes(token));
    router.push(`/content/post-types/${newPostType.id}`);
  };

  return (
    <>
      <Box pl={2}>
        <Typography variant="h4">Add Post Type</Typography>
        <PostTypeForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
      </Box>
    </>
  );
}

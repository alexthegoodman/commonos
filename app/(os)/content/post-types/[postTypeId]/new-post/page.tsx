"use client";

import PostForm from "@/components/content/forms/PostForm";
import { createPost, getPostType } from "@/fetchers/content";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function AddPost({ params }) {
  const postTypeId = params.postTypeId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: postTypeData,
    //   error,
    //   isLoading,
  } = useSWR("postType" + postTypeId, () => getPostType(token, postTypeId), {
    revalidateOnMount: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values) => {
    setIsLoading(true);
    console.info("onFormSubmit", values);
    const { title, markdown, ...fieldValues } = values;
    await createPost(token, postTypeId, title, markdown, fieldValues);
    mutate("postType" + postTypeId, () => getPostType(token, postTypeId));
    setIsLoading(false);
  };

  return (
    <>
      <Box pl={2}>
        <Typography variant="h4">New Post in {postTypeData?.name}</Typography>
        <PostForm
          postTypeData={postTypeData}
          onFormSubmit={onFormSubmit}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
}

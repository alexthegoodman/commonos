"use client";

import PostForm from "@/components/content/forms/PostForm";
import { createPost, getPost, getPostType } from "@/fetchers/content";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function AddPost({ params }) {
  const postTypeId = params.postTypeId;
  const postId = params.postId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: postTypeData,
    error: postTypeError,
    isLoading: postTypeLoading,
  } = useSWR("postType" + postTypeId, () => getPostType(token, postTypeId), {
    revalidateOnMount: true,
  });

  const {
    data: postData,
    error: postError,
    isLoading: postLoading,
  } = useSWR("post" + postId, () => getPost(token, postId), {
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
        <Typography variant="h4">Edit {postData?.title}</Typography>
        {!postTypeLoading && !postLoading && (
          <PostForm
            postTypeData={postTypeData}
            onFormSubmit={onFormSubmit}
            isLoading={isLoading}
            isUpdate={true}
            initialMarkdown={postData?.markdown}
            initialValues={{
              title: postData?.title,
              ...postData?.fields,
            }}
          />
        )}
      </Box>
    </>
  );
}

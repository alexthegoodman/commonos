"use client";

import ContentTable from "@/components/content/main/ContentTable";
import { deletePost, getPostType } from "@/fetchers/content";
import { Box, Button } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function PostType({ params }) {
  const postTypeId = params.postTypeId;

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: postTypeData,
    error,
    isLoading,
  } = useSWR("postType" + postTypeId, () => getPostType(token, postTypeId), {
    revalidateOnMount: true,
  });

  const handleRowDelete = async (id) => {
    console.info("handleRowDelete", id);
    await deletePost(token, id);
    mutate("postType" + postTypeId, () => getPostType(token, postTypeId));
  };

  return (
    <>
      <Box pl={2}>
        <ContentTable
          slug={postTypeId}
          title={`${postTypeData?.name}`}
          rightToolbar={
            <Box minWidth="150px">
              <Button
                href={`/content/post-types/${postTypeId}/new-post/`}
                variant="contained"
                color="success"
                size="small"
                fullWidth
              >
                Add Post
              </Button>
            </Box>
          }
          total={postTypeData?.postCount}
          rows={postTypeData?.posts}
          onDelete={handleRowDelete}
        />
      </Box>
    </>
  );
}

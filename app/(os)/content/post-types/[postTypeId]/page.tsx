"use client";

import ContentTable from "@/components/content/main/ContentTable";
import { getPostType } from "@/fetchers/content";
import { Box, Button } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

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

  return (
    <>
      <Box>
        <ContentTable
          slug={postTypeId}
          title={`${postTypeData?.name}`}
          rightToolbar={
            <Box minWidth="150px">
              <Button
                href={`/content/post-types/${postTypeId}/new-post/`}
                variant="contained"
                color="success"
                fullWidth
              >
                Add Post
              </Button>
            </Box>
          }
          //   total={companiesData?.count}
          rows={postTypeData?.posts}
          //   onDelete={handleRowDelete}
        />
      </Box>
    </>
  );
}

import { Box, Chip, Link, TextField, Typography, styled } from "@mui/material";
import { BlogTags } from "@/fixtures/blog";
import FormInput from "../fields/FormInput";

const Sidebar = styled("aside")(({ theme }) => ({
  width: "350px",
  padding: "25px 50px 0 0",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "100px",
}));

export default function BlogSidebar() {
  return (
    <Sidebar>
      <Typography variant="h4">CommonOS Blog</Typography>
      <TextField type="search" name="search" placeholder="Search blog..." />
      <Box mt={3}>
        {BlogTags.map((tag) => {
          return (
            <Link key={`tag-${tag.id}`} href={`/blog/tag/${tag.slug}`}>
              <Chip label={tag.tagName} style={{ marginRight: "5px" }} />
            </Link>
          );
        })}
      </Box>
      <Link href="/blog/">See All Posts</Link>
    </Sidebar>
  );
}

"use client";

import { BlogItems } from "@/fixtures/blog";
import { Box, Button, Grid, Link, Typography } from "@mui/material";

export default function BlogPage() {
  const mostRecentArticle = BlogItems[BlogItems.length - 1];
  const otherArticlesInOrder = BlogItems.filter(
    (item) => item.id !== mostRecentArticle.id
  ).reverse();

  return (
    <>
      <Box py={5}>
        <Typography variant="overline">
          {mostRecentArticle.dateCreated}
        </Typography>
        <Typography variant="h4" mb={1}>
          {mostRecentArticle.title}
        </Typography>
        <Typography variant="body1" mb={2}>
          {mostRecentArticle.description}
        </Typography>
        <Button
          href={`/blog/${mostRecentArticle.slug}`}
          color="success"
          variant="contained"
          style={{ width: "200px" }}
          size="small"
        >
          Read Article
        </Button>
      </Box>
      <Grid container mb="100px">
        {otherArticlesInOrder.map((article) => {
          return (
            <Grid key={`article-${article.id}`} item md={6} xs={12}>
              <Typography variant="overline">{article.dateCreated}</Typography>
              <Typography variant="h4">{article.title}</Typography>
              <Typography variant="body1">{article.description}</Typography>
              <Link href={`/blog/${article.slug}`}>Read Article</Link>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

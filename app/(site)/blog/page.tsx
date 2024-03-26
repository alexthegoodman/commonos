"use client";

import ArticleItem from "@/components/core/blog/ArticleItem";
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
        <Link href={`/blog/${mostRecentArticle.slug}`}>
          <Typography variant="h4" mb={1}>
            {mostRecentArticle.title}
          </Typography>
        </Link>
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
            <Grid
              key={`article-${article.id}`}
              item
              md={6}
              xs={12}
              paddingRight="50px"
              mb={2}
            >
              <ArticleItem article={article} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

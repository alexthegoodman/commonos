"use client";

import ArticleItem from "@/components/core/blog/ArticleItem";
import { BlogItems, BlogTags } from "@/fixtures/blog";
import { Grid, Link, Typography } from "@mui/material";

export default function TagPage({ params }) {
  const tagSlug = params.tagSlug;
  const tagData = BlogTags.find((tag) => tag.slug === tagSlug);
  const articles = BlogItems.filter((item) =>
    item.tags.includes(tagData?.id)
  ).reverse();

  return (
    <>
      <Typography variant="h4" mt={4} mb={2}>
        Tag: {tagData?.tagName}
      </Typography>
      <Grid container mb="100px">
        {articles.map((article) => {
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

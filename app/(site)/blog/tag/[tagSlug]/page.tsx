"use client";

import { BlogTags } from "@/fixtures/blog";

export default function TagPage({ params }) {
  const tagSlug = params.tagSlug;
  const tagData = BlogTags.find((tag) => tag.slug === tagSlug);

  return <>Tag: {tagData?.tagName}</>;
}

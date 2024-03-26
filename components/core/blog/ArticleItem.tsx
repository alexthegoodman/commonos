import { Link, Typography } from "@mui/material";

export default function ArticleItem({ article = null }) {
  return (
    <>
      <Typography variant="overline">{article?.dateCreated}</Typography>
      <Link href={`/blog/${article?.slug}`}>
        <Typography variant="h4">{article?.title}</Typography>
      </Link>
      <Typography variant="body1" mb={1}>
        {article?.description}
      </Typography>
      <Link href={`/blog/${article?.slug}`}>Read Article</Link>
    </>
  );
}

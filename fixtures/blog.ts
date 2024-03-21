export const BlogTags = [
  {
    id: 1,
    tagName: "Tag 1",
    slug: "tag-1",
  },
  {
    id: 2,
    tagName: "Tag 2",
    slug: "tag-2",
  },
  {
    id: 3,
    tagName: "Tag 3",
    slug: "tag-3",
  },
];

export const BlogAuthors = [
  {
    id: 1,
    name: "Alex Goodman",
  },
];

export const BlogItems = [
  {
    id: 1,
    title: "Test Title Here",
    slug: "test-title-here",
    dateCreated: "03-21-2024",
    author: 1,
    description:
      "This is a test description about a post which goes into detail on things such as this and that.",
    tags: [1, 2],
  },
  {
    id: 2,
    title: "Another Title",
    slug: "another-title",
    dateCreated: "03-21-2024",
    author: 1,
    description:
      "This is a test description about a post which goes into detail and says other things.",
    tags: [3],
  },
  {
    id: 3,
    title: "Test Title Here 2",
    slug: "test-title-here-2",
    dateCreated: "03-22-2024",
    author: 1,
    description:
      "This is a test description about a post which goes into detail on things such as this and the other thing.",
    tags: [2, 3],
  },
];

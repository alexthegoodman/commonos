import { gql } from "graphql-request";

export const myPostTypesQuery = gql`
  query MyPostTypes {
    myPostTypes {
      id
      name
      updatedAt
      createdAt
    }
  }
`;

export const createPostTypeMutation = gql`
  mutation CreatePostType($name: String!, $fields: String!) {
    createPostType(name: $name, fields: $fields) {
      id
      name
      updatedAt
      createdAt
    }
  }
`;

export const updatePostTypeMutation = gql`
  mutation UpdatePostType(
    $postTypeId: String!
    $name: String
    $fields: String
  ) {
    updatePostType(postTypeId: $postTypeId, name: $name, fields: $fields) {
      id
      name
      updatedAt
      createdAt
    }
  }
`;

export const postTypeQuery = gql`
  query PostType($postTypeId: String!) {
    postType: postType(postTypeId: $postTypeId) {
      id
      name
      fields

      posts {
        id
        title
        updatedAt
        createdAt
      }

      updatedAt
      createdAt
    }
    postCount: countPosts(postTypeId: $postTypeId)
  }
`;

export const createPostMutation = gql`
  mutation CreatePost(
    $postTypeId: String!
    $title: String!
    $markdown: String!
    $fields: String
  ) {
    createPost(
      postTypeId: $postTypeId
      title: $title
      markdown: $markdown
      fields: $fields
    ) {
      id
      title
      updatedAt
      createdAt
    }
  }
`;

export const updatePostMutation = gql`
  mutation UpdatePost(
    $postId: String!
    $title: String
    $markdown: String
    $fields: String
  ) {
    updatePost(
      postId: $postId
      title: $title
      markdown: $markdown
      fields: $fields
    ) {
      id
      title
      updatedAt
      createdAt
    }
  }
`;

export const myPostsQuery = gql`
  query MyPosts($postTypeId: String!) {
    rows: myPosts(postTypeId: $postTypeId) {
      id
      published
      title
      updatedAt
      createdAt
    }
    count: countPosts(postTypeId: $postTypeId)
  }
`;

export const postQuery = gql`
  query Post($postId: String!) {
    post(postId: $postId) {
      id
      published
      title
      markdown
      fields
      updatedAt
      createdAt
    }
  }
`;

export const togglePublishedMutation = gql`
  mutation TogglePublished($postId: String!) {
    togglePublished(postId: $postId) {
      id
      published
      updatedAt
      createdAt
    }
  }
`;

export const deletePostMutation = gql`
  mutation DeletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`;

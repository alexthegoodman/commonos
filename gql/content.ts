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
    postType(postTypeId: $postTypeId) {
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
  }
`;

export const createPostMutation = gql`
  mutation CreatePost($postTypeId: String!) {
    createPost(postTypeId: $postTypeId) {
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
    myPosts(postTypeId: $postTypeId) {
      id
      published
      title
      updatedAt
      createdAt
    }
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

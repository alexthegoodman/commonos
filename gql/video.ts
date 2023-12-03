import { gql } from "graphql-request";

export const newVideoMutation = gql`
  mutation NewVideoMutation {
    newVideo {
      id
    }
  }
`;

export const updateVideoMutation = gql`
  mutation UpdateVideo($videoId: String!, $title: String, $context: String) {
    updateVideo(videoId: $videoId, title: $title, context: $context) {
      id
    }
  }
`;

export const myVideosQuery = gql`
  query Videos {
    myVideos {
      id
      title

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

export const videoQuery = gql`
  query Video($videoId: String!) {
    video(videoId: $videoId) {
      id
      title
      context

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

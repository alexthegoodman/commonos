import { gql } from "graphql-request";

export const newSoundMutation = gql`
  mutation NewSoundMutation {
    newSound {
      id
    }
  }
`;

export const updateSoundMutation = gql`
  mutation UpdateSound($soundId: String!, $title: String, $context: String) {
    updateSound(soundId: $soundId, title: $title, context: $context) {
      id
    }
  }
`;

export const mySoundsQuery = gql`
  query Sounds {
    mySounds {
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

export const soundQuery = gql`
  query Sound($soundId: String!) {
    sound(soundId: $soundId) {
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

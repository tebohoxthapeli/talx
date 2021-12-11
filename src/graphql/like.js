import gql from "graphql-tag";

const TOGGLE_LIKE = gql`
  mutation toggleLike($post_id: ID!) {
    toggleLike(post_id: $post_id) {
      _id
      created_at

      liked_post {
        _id
        # body
        # created_at
      }

      poster {
        _id
        username
        # email
        # joined_on
        # website
        # location
        # about
      }

      liked_by {
        _id
        username
        # email
        # joined_on
        # website
        # location
        # about
      }
    }
  }
`;

const GET_POST_LIKES = gql`
  query getPostLikes($post_id: ID!) {
    getPostLikes(post_id: $post_id) {
      _id
      created_at

      liked_by {
        _id
        username
        # email
        # joined_on
        # website
        # location
        # about
      }

      # liked_post {
      #   _id
      #   body
      #   created_at
      # }

      # poster {
      #   _id
      #   username
      #   email
      #   joined_on
      #   website
      #   location
      #   about
      # }
    }
  }
`;

const IS_POST_LIKED = gql`
  query isPostLiked($post_id: ID!) {
    isPostLiked(post_id: $post_id)
  }
`;

export { TOGGLE_LIKE, GET_POST_LIKES, IS_POST_LIKED };

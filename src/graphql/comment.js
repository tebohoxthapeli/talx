import { gql } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation createComment($post_id: ID!, $body: String!) {
    createComment(post_id: $post_id, body: $body) {
      _id
      body
      created_at

      commented_by {
        _id
        username
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($comment_id: ID!) {
    deleteComment(comment_id: $comment_id)
  }
`;

const GET_POST_COMMENTS = gql`
  query getPostComments($post_id: ID!) {
    getPostComments(post_id: $post_id) {
      _id
      body
      created_at

      commented_by {
        _id
        username
      }
    }
  }
`;

export { CREATE_COMMENT, DELETE_COMMENT, GET_POST_COMMENTS };

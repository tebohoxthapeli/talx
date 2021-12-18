import { gql } from "@apollo/client";

const CREATE_POST = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            _id
            body
            created_at

            posted_by {
                _id
                username
            }
        }
    }
`;

const GET_POST = gql`
    query getPost($post_id: ID!) {
        getPost(post_id: $post_id) {
            _id
            body
            created_at

            posted_by {
                _id
                username
            }
        }
    }
`;

const GET_USER_POSTS = gql`
    query getUserPosts($user_id: ID!) {
        getUserPosts(user_id: $user_id) {
            _id
            body
            created_at

            posted_by {
                _id
                username
            }
        }
    }
`;

const GET_ALL_POSTS = gql`
    query getAllPosts {
        getAllPosts {
            _id
            body
            created_at

            posted_by {
                _id
                username
            }
        }
    }
`;

const DELETE_POST = gql`
    mutation deletePost($post_id: ID!) {
        deletePost(post_id: $post_id) {
            _id
            body
            created_at

            posted_by {
                _id
                username
            }
        }
    }
`;

export { CREATE_POST, GET_POST, GET_USER_POSTS, GET_ALL_POSTS, DELETE_POST };

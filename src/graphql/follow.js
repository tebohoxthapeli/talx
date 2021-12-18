import { gql } from "@apollo/client";

const TOGGLE_FOLLOW = gql`
    mutation toggleFollow($user_id: ID!) {
        toggleFollow(user_id: $user_id) {
            _id
            created_at

            follow_to {
                _id
                username
                about
            }

            follow_from {
                _id
                username
                about
            }
        }
    }
`;

const GET_USER_FOLLOWERS = gql`
    query getUserFollowers($user_id: ID!) {
        getUserFollowers(user_id: $user_id) {
            _id
            created_at

            follow_to {
                _id
                username
                about
            }

            follow_from {
                _id
                username
                about
            }
        }
    }
`;

const GET_USER_FOLLOWING = gql`
    query getUserFollowing($user_id: ID!) {
        getUserFollowing(user_id: $user_id) {
            _id
            created_at

            follow_to {
                _id
                username
                about
            }

            follow_from {
                _id
                username
                about
            }
        }
    }
`;

export { TOGGLE_FOLLOW, GET_USER_FOLLOWERS, GET_USER_FOLLOWING };

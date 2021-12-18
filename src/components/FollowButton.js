import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useMutation, useQuery, gql } from "@apollo/client";

import { TOGGLE_FOLLOW, GET_USER_FOLLOWING } from "../graphql/follow";
import { GET_ALL_POSTS } from "../graphql/post";
import { useDataLayerValue } from "../context/DataLayer";

export default function FollowButton({ user_id }) {
    const [
        {
            user: { _id: current_user },
        },
    ] = useDataLayerValue();

    const { data } = useQuery(GET_USER_FOLLOWING, {
        variables: { user_id: current_user },
    });

    const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(false);

    useEffect(() => {
        data &&
            setIsCurrentUserFollowing(
                data.getUserFollowing.find(({ follow_to }) => follow_to._id === user_id)
                    ? true
                    : false
            );
    }, [data, user_id]);

    const [toggleFollow] = useMutation(TOGGLE_FOLLOW, {
        variables: { user_id },

        refetchQueries: [
            {
                query: GET_ALL_POSTS,
            },
        ],

        update(cache, { data: { toggleFollow } }) {
            const newFollowRef = cache.writeFragment({
                data: toggleFollow,
                fragment: gql`
                    fragment NewFollow on Follow {
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
                `,
            });

            cache.modify({
                fields: {
                    getUserFollowing(existing, { storeFieldName }) {
                        const QueryField = `getUserFollowing({"user_id":"${current_user}"})`;

                        if (storeFieldName === QueryField) {
                            if (isCurrentUserFollowing) {
                                return existing.filter(({ __ref }) => __ref !== newFollowRef.__ref);
                            } else {
                                return [newFollowRef, ...existing];
                            }
                        }
                        return;
                    },

                    getUserFollowers(existing, { storeFieldName }) {
                        const QueryField = `getUserFollowers({"user_id":"${user_id}"})`;

                        if (storeFieldName === QueryField) {
                            if (isCurrentUserFollowing) {
                                return existing.filter(({ __ref }) => __ref !== newFollowRef.__ref);
                            } else {
                                return [newFollowRef, ...existing];
                            }
                        }
                        return;
                    },
                },
            });
        },

        onError(apolloError) {
            console.error(apolloError.message);
        },
    });

    const handleClick = () => {
        setIsCurrentUserFollowing(!isCurrentUserFollowing);
        toggleFollow();
        document.activeElement.blur();
    };

    return (
        <>
            {user_id !== current_user && (
                <Button
                    style={{ width: "7rem" }}
                    content={`${isCurrentUserFollowing ? "Unfollow" : "Follow"}`}
                    inverted
                    color={`${isCurrentUserFollowing ? "red" : "green"}`}
                    onClick={handleClick}
                />
            )}
        </>
    );
}

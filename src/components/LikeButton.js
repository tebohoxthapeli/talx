import React, { useState, useEffect } from "react";
import { Label, Button } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import MyPopup from "../util/MyPopup";
import { TOGGLE_LIKE } from "../graphql/like"; // removed GET_POST_LIKES
import { useDataLayerValue } from "../context/DataLayer";

export default function LikeButton({ post_id, likes }) {
    const [
        {
            user: { _id: current_user },
        },
    ] = useDataLayerValue();

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes.length);

    useEffect(() => {
        if (likes.find(({ liked_by }) => liked_by._id === current_user)) {
            setIsLiked(true);
        } else setIsLiked(false);
    }, [likes, current_user]);

    const [toggleLike] = useMutation(TOGGLE_LIKE, {
        variables: { post_id },

        update(cache, { data: { toggleLike } }) {
            cache.modify({
                fields: {
                    getPostLikes(existing, { storeFieldName }) {
                        const QueryField = `getPostLikes({"post_id":"${post_id}"})`;

                        const newLikeRef = cache.writeFragment({
                            data: toggleLike,
                            fragment: gql`
                                fragment NewLike on Like {
                                    _id
                                    created_at

                                    liked_by {
                                        _id
                                        username
                                    }

                                    liked_post {
                                        _id
                                    }

                                    poster {
                                        _id
                                        username
                                    }
                                }
                            `,
                        });

                        if (storeFieldName === QueryField) {
                            if (isLiked) {
                                return existing.filter(({ __ref }) => __ref !== newLikeRef.__ref);
                            } else {
                                return [newLikeRef, ...existing];
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
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(likeCount - 1);
        } else {
            setIsLiked(true);
            setLikeCount(likeCount + 1);
        }

        toggleLike();
    };

    const likeButton = isLiked ? (
        <Button color="orange" icon="heart" />
    ) : (
        <Button color="orange" basic icon="heart outline" />
    );

    return (
        <>
            <MyPopup content={isLiked ? "Unlike post" : "Like post"} position="top center">
                <Button as="div" labelPosition="right" onClick={handleClick}>
                    {likeButton}
                    <Label basic color="orange">
                        {likeCount}
                    </Label>
                </Button>
            </MyPopup>
        </>
    );
}

// () => {
//                         setIsLiked(!isLiked);
//                         toggleLike();
//                     }

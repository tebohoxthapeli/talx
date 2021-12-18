import React, { useState, useEffect } from "react";
import { Button, Confirm } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import MyPopup from "../util/MyPopup";
import { GET_ALL_POSTS, DELETE_POST } from "../graphql/post";
import { DELETE_COMMENT, GET_POST_COMMENTS } from "../graphql/comment";

export default function DeleteButton({ post_id, comment_id, callback, user_id }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [values, setValues] = useState({
        message: "Delete post",
        deleteMutation: DELETE_POST,
        getQuery: GET_ALL_POSTS,
        variable: { post_id },
        refetchVariables: null,
    });

    useEffect(() => {
        if (comment_id) {
            setValues({
                message: "Delete comment",
                deleteMutation: DELETE_COMMENT,
                getQuery: GET_POST_COMMENTS,
                variable: { comment_id },
                refetchVariables: { post_id },
            });
        } else {
            setValues({
                message: "Delete post",
                deleteMutation: DELETE_POST,
                getQuery: GET_ALL_POSTS,
                variable: { post_id },
                refetchVariables: null,
            });
        }
    }, [comment_id, post_id]); // eslint-disable-line

    const [deleteMutation] = useMutation(values.deleteMutation, {
        variables: values.variable,

        update(cache, { data }) {
            if (comment_id) {
                cache.modify({
                    fields: {
                        getPostComments(existing, { storeFieldName }) {
                            const getPostCommentsId = `getPostComments({"post_id": "${post_id}"})`;

                            if (storeFieldName === getPostCommentsId) {
                                const commentRef = cache.writeFragment({
                                    data: data.deleteComment,
                                    fragment: gql`
                                        fragment CommentRef on Comment {
                                            _id
                                            body
                                            created_at

                                            commented_by {
                                                _id
                                                username
                                            }
                                        }
                                    `,
                                });

                                return existing.filter(({ __ref }) => __ref !== commentRef.__ref);
                            }
                            return;
                        },
                    },
                });
            } else {
                const postRef = cache.writeFragment({
                    data: data.deletePost,
                    fragment: gql`
                        fragment PostRef on Post {
                            _id
                            body
                            created_at

                            posted_by {
                                _id
                                username
                            }
                        }
                    `,
                });

                cache.modify({
                    fields: {
                        getAllPosts(existing) {
                            return existing.filter(({ __ref }) => __ref !== postRef.__ref);
                        },

                        getUserPosts(existing, { storeFieldName }) {
                            const getUserPostsId = `getUserPosts({"user_id":"${user_id}"})`;

                            if (storeFieldName === getUserPostsId) {
                                return existing.filter(({ __ref }) => __ref !== postRef.__ref);
                            }
                            return;
                        },
                    },
                });
            }
        },

        onError(apolloError) {
            console.log(apolloError.message);
        },
    });

    function callDeleteMutation() {
        deleteMutation();
        setConfirmOpen(false);
        callback && callback();
    }

    return (
        <>
            <MyPopup content={values.message} position="top center">
                <Button
                    circular
                    inverted
                    color="red"
                    floated="right"
                    icon="trash"
                    onClick={() => setConfirmOpen(true)}
                />
            </MyPopup>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={callDeleteMutation}
                header={values.message}
                content="Are you sure? This action is irreversable."
            />
        </>
    );
}

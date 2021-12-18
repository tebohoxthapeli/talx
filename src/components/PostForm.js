import React from "react";
import { Form, Button, TextArea } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { useForm } from "../util/hooks";
import { CREATE_POST } from "../graphql/post";

import "../styles/form.css";

export default function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: "",
    });

    const [createPost, { loading }] = useMutation(CREATE_POST, {
        update(cache, { data: { createPost } }) {
            cache.modify({
                fields: {
                    getAllPosts(existing) {
                        const newPostRef = cache.writeFragment({
                            data: createPost,
                            fragment: gql`
                                fragment NewPost on Post {
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
                        return [newPostRef, ...existing];
                    },
                },
            });

            values.body = "";
        },

        onError(apolloError) {
            return apolloError;
        },
    });

    function createPostCallback() {
        createPost({ variables: values });
    }

    return (
        <div className="PostForm" style={{ width: "100%" }}>
            <Form onSubmit={onSubmit} autoComplete="off" size="large">
                <TextArea
                    placeholder="Say something..."
                    name="body"
                    autoFocus
                    maxLength="240"
                    value={values.body}
                    onChange={onChange}
                />

                <Button type="submit" className={`ovalBtn submitBtn ${loading && "loading"}`}>
                    Send post
                </Button>
            </Form>
        </div>
    );
}

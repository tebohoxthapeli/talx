import React, { useRef, useState } from "react";
import { Card, Form } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { CREATE_COMMENT } from "../graphql/comment";

import "../styles/form.css";
import "../styles/card.css";

export default function CommentForm({ post_id }) {
    const [body, setBody] = useState("");
    const commentInputRef = useRef(null);

    const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
        variables: { post_id, body },

        update(cache, { data: { createComment } }) {
            cache.modify({
                fields: {
                    getPostComments(existing, { storeFieldName }) {
                        const fieldName = `getPostComments({"post_id": "${post_id}"})`;

                        if (storeFieldName === fieldName) {
                            const newCommentRef = cache.writeFragment({
                                data: createComment,
                                fragment: gql`
                                    fragment NewComment on Comment {
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
                            return [newCommentRef, ...existing];
                        }
                        return;
                    },
                },
            });
            setBody("");
            commentInputRef.current.blur();
        },

        onError(apolloError) {
            console.log(apolloError.message);
        },
    });

    function callCreateComment() {
        createComment();
    }

    return (
        <div className="CommentForm">
            <Card fluid>
                <Card.Content style={{ background: "#171010" }}>
                    <Card.Header style={{ marginBottom: "0.7rem", color: "white" }}>
                        Type comment
                    </Card.Header>

                    <Form>
                        <div className="comment-form-wrapper">
                            <textarea
                                placeholder="Type your comment..."
                                name="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                autoComplete="off"
                                autoFocus
                                ref={commentInputRef}
                                maxLength="100"
                                rows="5"
                            />

                            <button
                                type="submit"
                                className={`ui button ovalBtn submitBtn ${loading && "loading"}`}
                                disabled={body.trim() === ""}
                                onClick={callCreateComment}
                                style={{ width: "30%" }}>
                                Send
                            </button>
                        </div>
                    </Form>
                </Card.Content>
            </Card>
        </div>
    );
}

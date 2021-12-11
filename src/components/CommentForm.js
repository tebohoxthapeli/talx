import React, { useRef, useState } from "react";
import { Card, Form } from "semantic-ui-react";

import { useMutation } from "@apollo/react-hooks";
import { CREATE_COMMENT, GET_POST_COMMENTS } from "../graphql/comment";

import "../styles/form.css";
import "../styles/card.css";

function CommentForm({ post_id }) {
  const [body, setBody] = useState("");
  const commentInputRef = useRef(null);

  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    variables: {
      post_id,
      body,
    },

    refetchQueries: [
      {
        query: GET_POST_COMMENTS,
        variables: { post_id },
      },
    ],

    onError(err) {
      console.log(err);
    },
  });

  function callCreateComment() {
    createComment();
    setBody("");
    commentInputRef.current.blur();
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
                className={`ui button ovalBtn submitBtn ${
                  loading && "loading"
                }`}
                disabled={body.trim() === ""}
                onClick={callCreateComment}
                style={{ width: "30%" }}
              >
                Send
              </button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}

export default CommentForm;

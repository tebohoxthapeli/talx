import React, { useState, useEffect } from "react";
import { Button, Confirm } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";

import { useMutation } from "@apollo/react-hooks";
import { GET_ALL_POSTS, DELETE_POST } from "../graphql/post";
import { DELETE_COMMENT, GET_POST_COMMENTS } from "../graphql/comment";

function DeleteButton({ post_id, comment_id, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [values, setValues] = useState({
    message: "Delete post",
    deleteMutation: DELETE_POST,
    getQuery: GET_ALL_POSTS,
    variable: { post_id },
  });

  useEffect(() => {
    if (comment_id) {
      setValues({
        message: "Delete comment",
        deleteMutation: DELETE_COMMENT,
        getQuery: GET_POST_COMMENTS,
        variable: { comment_id },
      });
    } else {
      setValues({
        message: "Delete post",
        deleteMutation: DELETE_POST,
        getQuery: GET_ALL_POSTS,
        variable: { post_id },
      });
    }
  }, [comment_id, post_id]);

  const [deleteMutation] = useMutation(values.deleteMutation, {
    variables: values.variable,

    refetchQueries: [
      {
        query: values.getQuery,
        variables: comment_id ? { post_id } : null,
      },
    ],

    onError(err) {
      throw new Error(err);
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

export default DeleteButton;

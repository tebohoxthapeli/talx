import React from "react";
import { Form, Button, TextArea } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { CREATE_POST } from "../graphql/post";

import "../styles/form.css";

function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: "",
    });

    const [createPost, { loading }] = useMutation(CREATE_POST, {
        variables: values,
        refetchQueries: ["getAllPosts"],
        onError(apolloError) {
            return apolloError;
        },
    });

    function createPostCallback() {
        createPost();
        values.body = "";
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

export default PostForm;

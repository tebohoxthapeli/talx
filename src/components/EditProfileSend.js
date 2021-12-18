import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Grid, Header } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { useContextMethods } from "../context/methods";
import { useForm } from "../util/hooks";
import { EDIT_USER } from "../graphql/user";

function EditProfileSend({ user: { _id: user_id, username, email, location, website, about } }) {
    const navigate = useNavigate();
    const { login } = useContextMethods();
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(editProfileCallback, {
        username,
        email,
        location,
        website,
        about,
    });

    const [editUser, { loading }] = useMutation(EDIT_USER, {
        variables: { ...values },

        update(cache, { data: { editUser } }) {
            cache.modify({
                fields: {
                    getUser(_, { storeFieldName }) {
                        const fieldName = `getUser({"user_id": "${user_id}"})`;

                        if (storeFieldName === fieldName) {
                            const editedUserRef = cache.writeFragment({
                                data: editUser,
                                fragment: gql`
                                    fragment EditedUser on User {
                                        _id
                                        username
                                        email
                                        joined_on
                                        website
                                        location
                                        about
                                    }
                                `,
                            });
                            return editedUserRef;
                        }
                        return;
                    },
                },
            });
        },

        onCompleted({ editUser }) {
            login(editUser);
            navigate(`/profile/${user_id}`, { replace: true });
        },

        onError(apolloError) {
            setErrors(apolloError.graphQLErrors[0].extensions.errors);
        },
    });

    function editProfileCallback() {
        editUser();
    }

    return (
        <div>
            <Grid textAlign="center" style={{ maxWidth: 500, minWidth: 500 }}>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h2" style={{ marginTop: "1rem" }}>
                            Edit Profile
                        </Header>

                        <Form size="small" autoComplete="off" noValidate onSubmit={onSubmit}>
                            <Form.Input
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                name="username"
                                type="text"
                                spellCheck="false"
                                autoFocus
                                value={values.username}
                                onChange={onChange}
                                className={`${errors.username && "inputError"}`}
                            />

                            <Form.Input
                                fluid
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email"
                                name="email"
                                type="email"
                                spellCheck="false"
                                value={values.email}
                                onChange={onChange}
                                className={`${errors.email && "inputError"}`}
                            />

                            <Form.Input
                                fluid
                                icon="compass"
                                iconPosition="left"
                                placeholder="Location"
                                name="location"
                                type="text"
                                value={values.location}
                                onChange={onChange}
                            />

                            <Form.Input
                                fluid
                                icon="globe"
                                iconPosition="left"
                                placeholder="Website"
                                name="website"
                                type="text"
                                spellCheck="false"
                                value={values.website}
                                onChange={onChange}
                            />

                            <Form.TextArea
                                placeholder="About me"
                                name="about"
                                autoComplete="off"
                                maxLength="100"
                                rows="5"
                                value={values.about}
                                onChange={onChange}
                            />

                            <Button
                                fluid
                                type="submit"
                                size="large"
                                className={`ovalBtn submitBtn ${loading && "loading"}`}>
                                Save
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Button
                            basic
                            inverted
                            name="toProfile"
                            as={Link}
                            to={`/profile/${user_id}`}>
                            Return to Profile
                        </Button>
                    </Grid.Column>
                </Grid.Row>

                {Object.keys(errors).length > 0 && (
                    <Grid.Row>
                        <Grid.Column>
                            <div className="ui error message">
                                <ul className="list">
                                    {Object.values(errors).map((value) => (
                                        <li key={value}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )}
            </Grid>
        </div>
    );
}

export default EditProfileSend;

// when you want to redirect:
// navigate(`/profile/${user_id}`, { replace: true });
//
// something else you can do
// navigate(-1) to go to the previous page
// navigate(-2) to the page before the last one
// navigate(1) to go forward again

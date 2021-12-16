import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Header, Grid, Container } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "../util/hooks";
import { useContextMethods } from "../context/methods";
import { useDataLayerValue } from "../context/DataLayer";
import { LOGIN } from "../graphql/user";

import "../styles/form.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useContextMethods();
    const [{ user }] = useDataLayerValue();

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: "",
        password: "",
    });

    const [loginUser, { loading }] = useMutation(LOGIN, {
        variables: values,

        onCompleted({ login: userData }) {
            login(userData);
            navigate("/", { replace: true });
        },

        onError(apolloError) {
            setErrors(apolloError.graphQLErrors[0].extensions.errors);
        },
    });

    function loginUserCallback() {
        loginUser();
    }

    return (
        <Container className="Form__Container">
            <Grid textAlign="center" style={{ maxWidth: 500 }}>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h2">Ready to connect with your friends?</Header>

                        <Form size="large" autoComplete="off" noValidate onSubmit={onSubmit}>
                            <Form.Input
                                fluid
                                inverted
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                name="username"
                                type="text"
                                autoFocus
                                spellCheck="false"
                                value={values.username}
                                onChange={onChange}
                                className={`${errors.username && "inputError"}`}
                            />

                            <Form.Input
                                fluid
                                inverted
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={onChange}
                                className={`${errors.password && "inputError"}`}
                            />

                            <Button
                                fluid
                                type="submit"
                                size="large"
                                className={`ovalBtn submitBtn ${loading && "loading"}`}>
                                Login
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Button basic inverted name="toRegister" as={Link} to="/register">
                            Don't have an account? Register
                        </Button>
                    </Grid.Column>
                </Grid.Row>

                {Object.keys(errors).length > 0 && (
                    <Grid.Row>
                        <Grid.Column>
                            <div className="ui error message errorList">
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
        </Container>
    );
}

export default Login;

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Grid, Container, Header } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { useContextMethods } from "../context/methods";
import { useForm } from "../util/hooks";
import { REGISTER } from "../graphql/user";

import "../styles/form.css";

function Register() {
  const { login } = useContextMethods();
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerCallback, {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [register, { loading }] = useMutation(REGISTER, {
    update(_, { data: { register: userData } }) {
      login(userData);
      history.push("/");
    },
    variables: values,
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  function registerCallback() {
    register();
  }

  return (
    <Container className="Form__Container">
      <Grid textAlign="center" style={{ width: 500 }}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h2">Join us by registering!</Header>

            <Form
              size="large"
              onSubmit={onSubmit}
              noValidate
              autoComplete="off"
            >
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
                name="username"
                type="text"
                value={values.username}
                onChange={onChange}
                autoFocus
                spellCheck="false"
                className={`${errors.username && "inputError"}`}
              />

              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={onChange}
                spellCheck="false"
                className={`${errors.email && "inputError"}`}
              />

              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={onChange}
                className={`${errors.password && "inputError"}`}
              />

              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Confirm password"
                type="password"
                name="confirm_password"
                value={values.confirm_password}
                onChange={onChange}
                className={`${errors.confirm_password && "inputError"}`}
              />

              <Button
                type="submit"
                fluid
                size="large"
                className={`ovalBtn submitBtn ${loading && "loading"}`}
              >
                Register
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Button name="toLogin" as={Link} to="/login" basic inverted>
              Return to Login
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
    </Container>
  );
}

export default Register;

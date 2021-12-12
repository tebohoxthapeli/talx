import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Header, Grid, Container } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";

import { useForm } from "../util/hooks";
import { useContextMethods } from "../context/methods";
import { LOGIN } from "../graphql/user";

import "../styles/form.css";

function Login() {
  const history = useHistory();
  const { login } = useContextMethods();

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [loginUser, { client, loading }] = useMutation(LOGIN, {
    variables: values,
    update(_, { data: { login: userData } }) {
      login(userData);
      history.push("/");
    },
    onError(apolloError) {
      setErrors(apolloError.graphQLErrors[0].extensions.errors);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    // clear the cache before login new user
    await client.clearStore();
    loginUser();
  };

  // const loginUserCallback = async () => {
  //   await client.clearStore();
  //   loginUser();
  // };

  // const { onChange, onSubmit, values } = useForm(loginUserCallback, {
  //   username: "",
  //   password: "",
  // });

  return (
    <Container className="Form__Container">
      <Grid textAlign="center" style={{ maxWidth: 500 }}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h2">Ready to connect with your friends?</Header>

            <Form
              size="large"
              autoComplete="off"
              noValidate
              onSubmit={onSubmit}
            >
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
                className={`ovalBtn submitBtn ${loading && "loading"}`}
              >
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
